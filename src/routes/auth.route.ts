import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { LoginUserDto, SignUpUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import adminAuthMiddleware from '@/middlewares/adminauth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(SignUpUserDto, 'body'),
      this.authController.signUp,
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginUserDto, 'body'),
      this.authController.logIn,
    );
    this.router.post(`${this.path}/logout`, adminAuthMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
