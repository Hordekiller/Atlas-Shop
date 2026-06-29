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
import { Response } from "express";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { clearAuthCookie, setAuthCookie } from "../../common/auth-cookie";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      addressTitle?: string;
      receiverName?: string;
      province?: string;
      city?: string;
      postalCode?: string;
      addressText?: string;
    },
  ) {
    const {
      addressTitle,
      receiverName,
      province,
      city,
      postalCode,
      addressText,
      ...rest
    } = body;
    const address = receiverName
      ? {
          title: addressTitle,
          receiverName,
          phone: body.phone || "",
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

  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() body: { email: string; password: string },
  ) {
    const result = await this.authService.login(body.email, body.password);
    setAuthCookie(response, result.token);
    return result;
  }

  @Post("otp-login")
  @ApiOperation({ summary: "Login with phone and OTP code" })
  async otpLogin(
    @Res({ passthrough: true }) response: Response,
    @Body() body: { phone: string; code: string },
  ) {
    const result = await this.authService.otpLogin(body.phone, body.code);
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
    @Body()
    body: {
      name?: string;
      phone?: string;
      nationalId?: string;
      birthDate?: string;
      avatar?: string;
    },
  ) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @Put("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change current user password" })
  async changePassword(
    @Req() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
}
