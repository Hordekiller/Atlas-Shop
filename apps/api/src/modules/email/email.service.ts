import { Injectable, Logger, Optional } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import * as nodemailer from "nodemailer";
import { NotificationQueueService } from "../notifications/notification-queue.service";
import { NotificationTemplatesService } from "../notification-templates/notification-templates.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;

  constructor(
    private prisma: PrismaService,
    @Optional() private queueService?: NotificationQueueService,
    @Optional() private templatesService?: NotificationTemplatesService,
  ) {
    this.fromEmail = process.env.MAIL_FROM || "noreply@example.com";
  }

  private async ensureTransporter() {
    if (this.transporter) return;
    const host = process.env.MAIL_HOST || "";
    const port = parseInt(process.env.MAIL_PORT || "587", 10);
    const user = process.env.MAIL_USER || "";
    const pass = process.env.MAIL_PASS || "";

    if (!host || host === "localhost") {
      throw new Error(
        "Mail transport not configured — set MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS env vars",
      );
    }

    try {
      const settings = await this.prisma.shopSettings.findUnique({
        where: { id: "singleton" },
      });
      this.fromEmail =
        process.env.MAIL_FROM ||
        settings?.contactEmail ||
        "noreply@example.com";

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: user ? { user, pass } : undefined,
      });
    } catch (e) {
      this.logger.error("Failed to setup email transport", e);
      throw e;
    }
  }

  async send(to: string, subject: string, html: string) {
    await this.ensureTransporter();
    try {
      await this.transporter!.sendMail({
        from: this.fromEmail,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (e) {
      this.logger.error(`Failed to send email to ${to}`, e);
      if (this.queueService) {
        this.queueService.addToQueue("email", { to, subject, html });
      }
    }
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string,
    userName: string,
    amount?: number,
  ) {
    // Try template
    if (this.templatesService) {
      const rendered = await this.templatesService.renderEmail(
        "order_confirmed",
        { orderNumber, userName, amount: amount || 0 },
      );
      if (rendered) {
        await this.send(email, rendered.subject, rendered.html);
        return;
      }
    }
    // Fallback
    await this.send(
      email,
      `تأیید سفارش ${orderNumber} — ${process.env.SITE_NAME || "فروشگاه من"}`,
      `<div style="font-family:Tahoma,sans-serif;max-width:600px;margin:auto;padding:24px;">
<h2 style="color:#ef4056;">سفارش شما ثبت شد ✅</h2>
<p>سلام ${userName}،</p>
<p>سفارش شما با شماره <strong>${orderNumber}</strong> با موفقیت ثبت شد.</p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e0e0e6;" />
<p style="color:#81858b;font-size:12px;">${process.env.SITE_NAME || "فروشگاه من"} — فروشگاه اینترنتی</p>
</div>`,
    );
  }

  async sendOrderStatusUpdate(
    email: string,
    orderNumber: string,
    status: string,
    userName: string,
  ) {
    const statusLabels: Record<string, string> = {
      confirmed: "تأیید شده",
      processing: "در حال پردازش",
      shipped: "ارسال شده",
      delivered: "تحویل شده",
      cancelled: "لغو شده",
      returned: "مرجوع شده",
    };
    const label = statusLabels[status] || status;

    // Try template
    const notifType =
      status === "cancelled" ? "order_cancelled" : "order_status_change";
    if (this.templatesService) {
      const rendered = await this.templatesService.renderEmail(notifType, {
        orderNumber,
        status,
        statusLabel: label,
        userName,
      });
      if (rendered) {
        await this.send(email, rendered.subject, rendered.html);
        return;
      }
    }
    // Fallback
    await this.send(
      email,
      `بروزرسانی وضعیت سفارش ${orderNumber} — ${process.env.SITE_NAME || "فروشگاه من"}`,
      `<div style="font-family:Tahoma,sans-serif;max-width:600px;margin:auto;padding:24px;">
<h2 style="color:#ef4056;">بروزرسانی وضعیت سفارش 🔔</h2>
<p>سلام ${userName}،</p>
<p>وضعیت سفارش <strong>${orderNumber}</strong> به <strong>${label}</strong> تغییر کرد.</p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e0e0e6;" />
<p style="color:#81858b;font-size:12px;">${process.env.SITE_NAME || "فروشگاه من"} — فروشگاه اینترنتی</p>
</div>`,
    );
  }
}
