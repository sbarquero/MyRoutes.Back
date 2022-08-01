import { NextFunction, Request, Response } from 'express';
import {
  LoginUserDto,
  LogoutSessionDto,
  RecoverPasswordDto,
  RefreshTokenDto,
  RegisterUserDto,
  RejectSessionDto,
  ResetPasswordDto,
} from '@dtos/auth.dto';
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

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshData: RefreshTokenDto = req.body;
      const loginResponse = await this.authService.refresh(refreshData);

      res.status(200).json(loginResponse);
    } catch (error) {
      next(error);
    }
  };

  public reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rejectData: RejectSessionDto = req.body;
      const rejectResponse = await this.authService.reject(rejectData);

      res.status(200).json({ data: rejectResponse, message: 'Session rejected' });
    } catch (error) {
      next(error);
    }
  };

  public recover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recoverData: RecoverPasswordDto = { email: req.body.email };

      const recoverResponse = await this.authService.recover(recoverData);

      res.status(200).json({ data: recoverResponse, message: 'Email sent' });
    } catch (error) {
      next(error);
    }
  };

  public reset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetPasswordData: ResetPasswordDto = {
        token: req.body.token,
        password: req.body.password,
      };

      const resetResponse = await this.authService.reset(resetPasswordData);

      res.status(200).json({ data: resetResponse, message: 'Password reset' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
