import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  title!: string;

  @IsString()
  venueId!: string;

  @IsString()
  courtId!: string;

  @IsString()
  slotId!: string;

  @IsString()
  level!: string;

  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers!: number;
}
