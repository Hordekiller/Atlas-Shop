import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { EncryptionService } from "../settings/encryption.service";
const ZARINPAL_API = "https://api.zarinpal.com/pg/v4";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  async requestPayment(orderId: number, gateway = "zarinpal") {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.paymentStatus === "PAID")
      throw new BadRequestException("Order already paid");

    const normalizedGateway = gateway.toLowerCase();
    const availableGateways = await this.getPaymentGateways();
    if (!availableGateways.some((item) => item.id === normalizedGateway)) {
      throw new BadRequestException("Unsupported or disabled payment gateway");
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId, status: "PENDING", gateway: normalizedGateway },
    });

    if (existingPayment) {
      return {
        paymentId: existingPayment.id,
        authority: existingPayment.authority,
        gateway: normalizedGateway,
        amount: existingPayment.amount,
        paymentUrl: existingPayment.authority
          ? this.getPaymentUrl(normalizedGateway, existingPayment.authority)
          : "#",
      };
    }

    let authority: string;
    let paymentUrl: string;

    switch (normalizedGateway) {
      case "zarinpal":
        const result = await this.requestZarinpalPayment(order.total.toNumber(), order.id);
        authority = result.authority;
        paymentUrl = result.url;
        break;
      default:
        throw new BadRequestException("Unsupported payment gateway");
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        authority,
        gateway: normalizedGateway,
        status: "PENDING",
      },
    });

    return {
      paymentId: payment.id,
      authority,
      gateway: normalizedGateway,
      amount: order.total,
      paymentUrl,
    };
  }

  async verifyPayment(authority: string, status?: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { authority },
      include: { order: true },
    });

    if (!payment) throw new NotFoundException("Payment not found");

    let verified = false;
    let refId: string | null = null;

    if (payment.gateway === "zarinpal") {
      const result = await this.verifyZarinpalPayment(
        authority,
        payment.amount.toNumber(),
      );
      verified = result.verified;
      refId = result.refId;
    } else {
      throw new BadRequestException("Unsupported payment gateway");
    }

    if (verified) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", referenceId: refId, paidAt: new Date() },
      });

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paidAt: new Date(),
        },
      });

      return {
        success: true,
        referenceId: refId,
        orderNumber: payment.order.orderNumber,
      };
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    return { success: false, message: "Payment failed" };
  }

  async getPaymentGateways() {
    const merchantId = await this.getZarinpalMerchantId();
    return merchantId
      ? [{ id: "zarinpal", name: "زرین‌پال", icon: "zarinpal.png" }]
      : [];
  }

  private getPaymentUrl(gateway: string, authority: string): string {
    switch (gateway) {
      case "zarinpal":
        return `https://www.zarinpal.com/pg/StartPay/${authority}`;
      default:
        return "#";
    }
  }

  private async requestZarinpalPayment(amount: number, orderId: number) {
    const merchantId = await this.getZarinpalMerchantId();
    if (!merchantId) {
      throw new ServiceUnavailableException("Zarinpal merchant is not configured");
    }

    const callbackUrl =
      process.env.ZARINPAL_CALLBACK_URL ||
      `http://localhost:8000/api/v1/payments/verify`;

    const response = await fetch(`${ZARINPAL_API}/payment/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount,
        description: `سفارش شماره ${orderId}`,
        callback_url: callbackUrl,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (data.data && data.data.authority) {
      return {
        authority: data.data.authority,
        url: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
      };
    }

    throw new ServiceUnavailableException(
      data.errors?.message || "Zarinpal payment request failed",
    );
  }

  private async verifyZarinpalPayment(authority: string, amount: number) {
    const merchantId = await this.getZarinpalMerchantId();
    if (!merchantId) {
      throw new ServiceUnavailableException("Zarinpal merchant is not configured");
    }

    const response = await fetch(`${ZARINPAL_API}/payment/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        authority,
        amount,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (data.data && data.data.ref_id) {
      return { verified: true, refId: String(data.data.ref_id) };
    }

    return { verified: false, refId: null };
  }

  private async getZarinpalMerchantId() {
    const settings = await this.prisma.shopSettings.findUnique({
      where: { id: "singleton" },
      select: { zarinpalMerchant: true },
    });
    const fromSettings = this.encryption.decrypt(settings?.zarinpalMerchant || "");
    const merchantId = fromSettings || process.env.ZARINPAL_MERCHANT_ID || "";
    if (!merchantId || /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(merchantId)) {
      return "";
    }
    return merchantId;
  }
}
