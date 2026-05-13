import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateThreadMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content!: string;
}
