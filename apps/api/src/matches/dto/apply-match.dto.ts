import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  userId?: string;
}
