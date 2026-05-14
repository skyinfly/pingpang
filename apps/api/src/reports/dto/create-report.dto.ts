import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MaxLength(64)
  targetUserId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(280)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  matchId?: string;
}
