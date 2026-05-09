import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectMatchApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  reason?: string;
}
