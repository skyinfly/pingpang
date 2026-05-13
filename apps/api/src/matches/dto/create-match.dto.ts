import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  title!: string;

  @IsString()
  @MaxLength(64)
  venueId!: string;

  @IsString()
  @MaxLength(64)
  courtId!: string;

  @IsString()
  @MaxLength(64)
  slotId!: string;

  @IsString()
  @MaxLength(32)
  level!: string;

  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers!: number;
}
