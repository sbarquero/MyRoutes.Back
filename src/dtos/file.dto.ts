import { Transform } from 'class-transformer';
import { IsDefined, IsString, Length } from 'class-validator';

export class FileUploadDto {
  file: Buffer;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsDefined()
  @IsString()
  @Length(24, 24)
  userId: String;
}
