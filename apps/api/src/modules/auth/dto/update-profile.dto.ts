import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nationalId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;
}
