import { IsEmail, IsString, Length } from 'class-validator';

export class LoginEmailDto {
  @IsEmail()
  @Length(5, 254)
  email!: string;

  @IsString()
  @Length(8, 100)
  password!: string;
}
