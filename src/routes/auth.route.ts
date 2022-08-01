import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import {
  ActivateUserDto,
  LoginUserDto,
  LogoutSessionDto,
  RecoverPasswordDto,
  RegisterUserDto,
  RejectSessionDto,
  ResetPasswordDto,
} from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { RefreshTokenDto } from '@/dtos/auth.dto';
import adminAuthMiddleware from '@/middlewares/adminauth.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterUserDto, 'body'),
      this.authController.register,
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginUserDto, 'body'),
      this.authController.logIn,
    );
    this.router.post(
      `${this.path}/logout`,
      validationMiddleware(LogoutSessionDto, 'body'),
      this.authController.logOut,
    );
    this.router.post(
      `${this.path}/refresh`,
      validationMiddleware(RefreshTokenDto, 'body'),
      this.authController.refresh,
    );
    this.router.post(
      `${this.path}/reject`,
      validationMiddleware(RejectSessionDto, 'body'),
      adminAuthMiddleware,
      this.authController.reject,
    );
    this.router.post(
      `${this.path}/recover`,
      validationMiddleware(RecoverPasswordDto, 'body'),
      this.authController.recover,
    );
    this.router.post(
      `${this.path}/reset-password`,
      validationMiddleware(ResetPasswordDto, 'body'),
      this.authController.reset,
    );
    this.router.post(
      `${this.path}/activate-user`,
      validationMiddleware(ActivateUserDto, 'body'),
      this.authController.activate,
    );
  }
}

export default AuthRoute;
