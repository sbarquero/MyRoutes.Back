import { IsEmail, IsString, IsUUID, Length, MinLength } from 'class-validator';

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

export class RefreshTokenDto {
  @IsString()
  @Length(24, 24)
  userId: string;

  @IsString()
  @Length(24, 24)
  sessionId: string;

  @IsUUID(4)
  refreshToken: string;
}

export class RejectSessionDto {
  @IsString()
  @Length(24, 24)
  userId: string;

  @IsString()
  @Length(24, 24)
  sessionId: string;

  @IsUUID(4)
  refreshToken: string;
}

export class RecoverPasswordDto {
  @IsEmail()
  public email: string;
}

export class ResetPasswordDto {
  @IsString()
  @Length(32, 32)
  public token: string;

  @IsString()
  @MinLength(6)
  public password: string;
}

export class AuthResponseDto {
  public userId: string;
  public userName: string;
  public email: string;
  public rol: string;
  public token: string;
  public sessionId: string;
  public refreshToken: string;
  public expireAt: Date;
}

export class ActivateUserDto {
  @IsString()
  @Length(32, 32)
  public token: string;
}

export class ActivateResponseDto {
  public email: string;
}
