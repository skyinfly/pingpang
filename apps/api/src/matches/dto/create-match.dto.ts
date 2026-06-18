import { IsInt, IsISO8601, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  title!: string;

  @IsString()
  @MaxLength(64)
  venueId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  courtId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  slotId?: string;

  /**
   * Host-typed court label (e.g. "3 号台"). Optional at create time —
   * the host can fill it in later from the match detail page once
   * players actually arrive at the venue.
   */
  @IsOptional()
  @IsString()
  @MaxLength(32)
  courtName?: string;

  /**
   * Custom start time as ISO-8601. Used when no `slotId` is supplied
   * so hosts can pick any time, not just a preset venue slot.
   */
  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @IsString()
  @MaxLength(32)
  level!: string;

  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers!: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  coverUrl?: string;
}
