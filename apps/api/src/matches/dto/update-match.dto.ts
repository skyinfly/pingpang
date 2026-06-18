import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Host-only patch fields. Today only the typed court label is
 * editable post-creation — used so the host can fill in "3 号台"
 * once they actually arrive at the venue.
 */
export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  courtName?: string;
}
