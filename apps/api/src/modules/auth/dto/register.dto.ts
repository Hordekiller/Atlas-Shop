import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "علی محمدی" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: "09121234567" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: "strongPassword123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  receiverName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressText?: string;
}
