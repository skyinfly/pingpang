import { IsString, Matches } from 'class-validator';

export class VerifyLoginCodeDto {
  @IsString()
  @Matches(/^1\d{10}$/)
  phone!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
