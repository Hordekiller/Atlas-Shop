import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export abstract class SmsProvider {
  abstract send(phone: string, message: string): Promise<void>;
}

@Injectable()
export class ConsoleSmsProvider extends SmsProvider {
  private readonly logger = new Logger(ConsoleSmsProvider.name);

  async send(phone: string, message: string): Promise<void> {
    this.logger.log(`[SMS] To: ${phone} — ${message}`);
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
    this.sender = this.configService.get<string>("SMS_SENDER", "");
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

    this.logger.log(`OTP sent to ${phone} via Kavenegar`);
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
    const message = `کد تایید فروشگاه اطلس: ${code}`;
    await this.provider.send(phone, message);
  }
}
