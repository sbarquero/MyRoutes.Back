import { IsString, MinLength } from 'class-validator';

export class UpdateConfigurationDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsString()
  @MinLength(6)
  public password: string;
}
