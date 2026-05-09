import { IsString, Matches } from 'class-validator';

export class RequestLoginCodeDto {
  @IsString()
  @Matches(/^1\d{10}$/)
  phone!: string;
}
