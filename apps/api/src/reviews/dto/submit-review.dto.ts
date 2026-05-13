import { ArrayMaxSize, IsArray, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @MaxLength(64)
  matchId!: string;

  @IsString()
  @MaxLength(64)
  revieweeId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(32, { each: true })
  tags!: string[];
}
