import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

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

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(6)
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class LoginResponseDto {
  public userId: number;
  public userName: string;
  public rol: string;
  public token: string;
  public sessionId: string;
  public refreshToken: string;
  public expireAt: Date;
}

export class LogoutSessionDto {
  @IsString()
  @Length(24, 24)
  userId: string;

  @IsString()
  @Length(24, 24)
  sessionId: string;

  @IsUUID(4)
  refreshToken: string;
}
