import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export abstract class SmsProvider {
  abstract send(phone: string, message: string): Promise<void>;
  abstract sendVerification(
    phone: string,
    template: string,
    token: string,
    token2?: string,
    token3?: string,
  ): Promise<void>;
}

@Injectable()
export class ConsoleSmsProvider extends SmsProvider {
  private readonly logger = new Logger(ConsoleSmsProvider.name);

  async send(phone: string, message: string): Promise<void> {
    this.logger.log(`[SMS] To: ${phone} — ${message}`);
  }

  async sendVerification(
    phone: string,
    template: string,
    token: string,
    token2?: string,
    token3?: string,
  ): Promise<void> {
    this.logger.log(
      `[SMS Verify] To: ${phone}, template: ${template}, tokens: ${[token, token2, token3].filter(Boolean).join(", ")}`,
    );
  }
}

@Injectable()
export class KavenegarSmsProvider extends SmsProvider {
  private readonly logger = new Logger(KavenegarSmsProvider.name);
  private readonly apiKey: string;
  private readonly sender: string;
  private readonly baseUrl = "https://api.kavenegar.com/v1";

  constructor(private configService: ConfigService) {
    super();
    this.apiKey = this.configService.get<string>("SMS_API_KEY", "");
    this.sender = this.configService.get<string>("SMS_SENDER", "10004346");
  }

  async send(phone: string, message: string): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn("SMS_API_KEY not set, falling back to console log");
      this.logger.log(`[SMS] To: ${phone} — ${message}`);
      return;
    }

    const url = `${this.baseUrl}/${this.apiKey}/sms/send.json`;
    const params = new URLSearchParams({
      receptor: phone,
      sender: this.sender,
      message,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(
        `Kavenegar send failed (${response.status}): ${body}`,
      );
      throw new Error(`SMS send failed: ${response.statusText}`);
    }

    this.logger.log(`Message sent to ${phone} via Kavenegar`);
  }

  async sendVerification(
    phone: string,
    template: string,
    token: string,
    token2?: string,
    token3?: string,
  ): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn("SMS_API_KEY not set, falling back to console log");
      this.logger.log(
        `[SMS Verify] To: ${phone}, template: ${template}, token: ${token}${token2 ? `, token2: ${token2}` : ""}${token3 ? `, token3: ${token3}` : ""}`,
      );
      return;
    }

    const url = `${this.baseUrl}/${this.apiKey}/verify/lookup.json`;
    const params = new URLSearchParams({
      receptor: phone,
      token,
      template,
    });
    if (token2) params.set("token2", token2);
    if (token3) params.set("token3", token3);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(
        `Kavenegar verify failed (${response.status}): ${body}`,
      );
      throw new Error(`SMS verify failed: ${response.statusText}`);
    }

    this.logger.log(
      `Verification sent to ${phone} (template: ${template}) via Kavenegar`,
    );
  }
}

@Injectable()
export class SmsService {
  private readonly provider: SmsProvider;
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {
    const providerName =
      this.configService.get<string>("SMS_PROVIDER") || "console";

    switch (providerName) {
      case "kavenegar":
        this.provider = new KavenegarSmsProvider(this.configService);
        this.logger.log("SMS provider: Kavenegar");
        break;
      case "console":
      default:
        this.provider = new ConsoleSmsProvider();
        this.logger.log("SMS provider: Console (development)");
        break;
    }
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    const siteName = process.env.SITE_NAME || "فروشگاه من";
    const message = `کد تایید ${siteName}: ${code}`;
    await this.provider.send(phone, message);
  }

  async sendVerificationCode(
    phone: string,
    code: string,
    template = "registerverify",
  ): Promise<void> {
    await this.provider.sendVerification(phone, template, code);
  }

  async sendRaw(phone: string, message: string): Promise<void> {
    await this.provider.send(phone, message);
  }
}
