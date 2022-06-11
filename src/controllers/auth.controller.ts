import { NextFunction, Request, Response } from 'express';
import { LoginUserDto, LogoutSessionDto, RegisterUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterUserDto = req.body;
      const registerUserData: User = await this.authService.register(userData);

      res.status(201).json(registerUserData);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const loginResponse = await this.authService.login(userData);

      res.status(200).json(loginResponse);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logoutData: LogoutSessionDto = req.body;
      const logoutResponse = await this.authService.logout(logoutData);

      res.status(200).json({ data: logoutResponse, message: 'Session closed' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
