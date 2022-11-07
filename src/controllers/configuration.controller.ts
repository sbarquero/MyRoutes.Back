import { NextFunction, Request, Response } from 'express';

import { getUserIdFromAuthorizationToken } from '@/utils/auth';
import { HttpException } from '@/exceptions/HttpException';
import { UpdateUserDto } from '@/dtos/user.dto';
import { User } from '@/interfaces/user.interface';
import UserService from '@/services/user.service';

class ConfigurationController {
  public userService = new UserService();

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const tokenUserId = getUserIdFromAuthorizationToken(req);

      if (userId !== tokenUserId) throw new HttpException(401, 'Not authorized');

      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: UpdateUserDto = req.body;
      const tokenUserId = getUserIdFromAuthorizationToken(req);

      if (userId !== tokenUserId) throw new HttpException(401, 'Not authorized');

      await this.userService.updateUser(userId, userData);

      res.status(200).json({ message: 'User updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default ConfigurationController;
