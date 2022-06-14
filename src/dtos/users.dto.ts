import { IsBoolean, IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString()
  @IsIn(['user', 'admin'])
  public rol: string;

  @IsBoolean()
  public active: boolean;

  @IsBoolean()
  public google: boolean;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsString()
  @MinLength(6)
  public password: string;

  @IsString()
  @IsIn(['user', 'admin'])
  public rol: string;

  @IsBoolean()
  public active: boolean;

  @IsBoolean()
  public google: boolean;
}
