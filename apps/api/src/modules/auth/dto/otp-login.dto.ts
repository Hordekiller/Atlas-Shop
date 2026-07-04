import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OtpLoginDto {
  @ApiProperty({ example: "09121234567" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
