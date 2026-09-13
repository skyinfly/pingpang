import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class RequestEmailCodeDto {
  @IsEmail()
  @Length(5, 254)
  email!: string;

  @IsOptional()
  @IsString()
  @IsIn(['register', 'login', 'reset_password'])
  intent?: 'register' | 'login' | 'reset_password';
}
