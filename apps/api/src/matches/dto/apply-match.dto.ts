import { IsOptional, IsString } from 'class-validator';

export class ApplyMatchDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
