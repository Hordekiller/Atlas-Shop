import { Module } from "@nestjs/common";
import { OtpController } from "./otp.controller";
import { OtpService } from "./otp.service";
import { SmsModule } from "../sms/sms.module";

@Module({
  imports: [SmsModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
