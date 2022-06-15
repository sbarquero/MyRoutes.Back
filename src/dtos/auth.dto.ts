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
