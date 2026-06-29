import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import type { SignOptions } from "jsonwebtoken";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { OtpModule } from "../otp/otp.module";

function requireJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
}

function jwtExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: requireJwtSecret(),
      signOptions: {
        expiresIn: jwtExpiresIn(),
      },
    }),
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
