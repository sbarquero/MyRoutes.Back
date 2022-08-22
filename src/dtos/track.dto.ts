import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  @MinLength(3)
  public name: string;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  public description: string;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  @Length(24, 24)
  public userId: string;

  @Transform(({ value }) => Boolean(value), { toClassOnly: true })
  @IsBoolean()
  public isPublic: boolean;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  public fileName: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsDefined()
  public createAt: Date;

  file: Buffer;
}

export class UpdateTrackDto {
  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  @MinLength(3)
  public name: string;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsString()
  @IsDefined()
  public description: string;

  @Transform(({ value }) => Boolean(value), { toClassOnly: true })
  @IsBoolean()
  public isPublic: boolean;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsDefined()
  public createAt: Date;
}
