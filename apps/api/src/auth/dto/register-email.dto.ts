import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';

/**
 * Email + password registration. No OTP — H5 can't reliably deliver SMS
 * and we'd rather skip the email-code dance and let the user pick a
 * password directly.
 */
export class RegisterEmailDto {
  @IsEmail()
  @Length(5, 254)
  email!: string;

  @IsString()
  @Length(8, 100, { message: 'password must be 8-100 characters' })
  password!: string;

  @IsString()
  @Length(2, 20)
  nickname!: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  city?: string;

  @IsOptional()
  @IsIn(['beginner', 'intermediate', 'advanced'])
  level?: 'beginner' | 'intermediate' | 'advanced';
}
