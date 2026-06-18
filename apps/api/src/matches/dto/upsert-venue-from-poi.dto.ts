import { IsLatitude, IsLongitude, IsOptional, IsString, Length } from 'class-validator';

/**
 * Payload for /matches/venues/from-poi. The client got these fields from
 * GET /location/poi/search so they all map back to a real AMap POI.
 */
export class UpsertVenueFromPoiDto {
  @IsString()
  @Length(1, 64)
  amapPoiId!: string;

  @IsString()
  @Length(1, 80)
  name!: string;

  @IsString()
  @Length(1, 40)
  city!: string;

  @IsOptional()
  @IsString()
  @Length(0, 40)
  district?: string;

  @IsString()
  @Length(1, 200)
  address!: string;

  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lng!: number;
}
