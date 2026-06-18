import { IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

/**
 * Phone-based registration: caller has already proven possession of the
 * phone number by passing OTP verification, and now picks their display
 * profile. Auto-login on success.
 */
export class RegisterDto {
  @IsString()
  @Matches(/^1\d{10}$/)
  phone!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;

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
