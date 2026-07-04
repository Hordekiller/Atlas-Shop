import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Response } from "express";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { clearAuthCookie, setAuthCookie } from "../../common/auth-cookie";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { OtpLoginDto } from "./dto/otp-login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: RegisterDto,
  ) {
    const {
      addressTitle,
      receiverName,
      province,
      city,
      postalCode,
      addressText,
      ...rest
    } = dto;
    const address = receiverName
      ? {
          title: addressTitle,
          receiverName,
          phone: dto.phone || "",
          province: province || "",
          city: city || "",
          postalCode: postalCode || "",
          addressText: addressText || "",
        }
      : undefined;
    const result = await this.authService.register({ ...rest, address });
    setAuthCookie(response, result.token);
    return result;
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginDto,
  ) {
    const result = await this.authService.login(dto.email, dto.password);
    setAuthCookie(response, result.token);
    return result;
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("otp-login")
  @ApiOperation({ summary: "Login with phone and OTP code" })
  async otpLogin(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: OtpLoginDto,
  ) {
    const result = await this.authService.otpLogin(dto.phone, dto.code);
    setAuthCookie(response, result.token);
    return result;
  }

  @Post("logout")
  @ApiOperation({ summary: "Clear auth cookie" })
  async logout(@Res({ passthrough: true }) response: Response) {
    clearAuthCookie(response);
    return { message: "Logged out" };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async me(@Req() req: any) {
    return this.authService.me(req.user.id);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user profile" })
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  @Put("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change current user password" })
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
