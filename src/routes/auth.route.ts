import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { LoginUserDto, LogoutSessionDto, RegisterUserDto } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { RefreshTokenDto } from '@/dtos/auth.dto';

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
  }
}

export default AuthRoute;
