import { Controller, Post, Body } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { OtpService } from "./otp.service";

class RequestOtpDto {
  phone: string;
}

class VerifyOtpDto {
  phone: string;
  code: string;
}

@ApiTags("OTP")
@Controller("otp")
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post("request")
  @ApiOperation({ summary: "Request OTP code sent via SMS" })
  async request(@Body() dto: RequestOtpDto) {
    return this.otpService.request(dto.phone);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("verify")
  @ApiOperation({ summary: "Verify OTP code" })
  async verify(@Body() dto: VerifyOtpDto) {
    return this.otpService.verify(dto.phone, dto.code);
  }
}
