import {
  IsBoolean,
  IsDefined,
  IsObject,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsDefined()
  @MinLength(3)
  public name: string;

  @IsString()
  @IsDefined()
  public description: string;

  @IsString()
  @IsDefined()
  @Length(24, 24)
  public userId: string;

  @IsBoolean()
  public isPublic: boolean;

  @IsObject()
  @IsDefined()
  public geojsonData: Object;
}
