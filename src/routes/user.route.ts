import { Router } from 'express';

import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import UserController from '@/controllers/user.controller';
import validationMiddleware from '@/middlewares/validation.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware('admin'),
      this.userController.getUsers,
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware('admin'),
      this.userController.getUserById,
    );
    this.router.post(
      `${this.path}`,
      authMiddleware('admin'),
      validationMiddleware(CreateUserDto, 'body'),
      this.userController.createUser,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware('admin'),
      validationMiddleware(UpdateUserDto, 'body', true),
      this.userController.updateUser,
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware('admin'),
      this.userController.deleteUser,
    );
  }
}

export default UserRoute;
