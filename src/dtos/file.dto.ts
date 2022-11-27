import { IsDefined, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class FileUploadDto {
  file: Buffer;

  @Transform(({ value }) => String(value), { toClassOnly: true })
  @IsDefined()
  @IsString()
  @Length(24, 24)
  userId: String;
}
