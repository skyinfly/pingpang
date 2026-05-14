import { IsString, Matches } from 'class-validator';

export class CheckInDto {
  @IsString()
  @Matches(/^[A-Za-z0-9]{6}$/)
  code!: string;
}
