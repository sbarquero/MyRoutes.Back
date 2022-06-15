import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import adminAuthMiddleware from '@/middlewares/adminauth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, adminAuthMiddleware, this.usersController.getUsers);
    this.router.get(
      `${this.path}/:id`,
      adminAuthMiddleware,
      this.usersController.getUserById,
    );
    this.router.post(
      `${this.path}`,
      adminAuthMiddleware,
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser,
    );
    this.router.put(
      `${this.path}/:id`,
      adminAuthMiddleware,
      validationMiddleware(UpdateUserDto, 'body', true),
      this.usersController.updateUser,
    );
    this.router.delete(
      `${this.path}/:id`,
      adminAuthMiddleware,
      this.usersController.deleteUser,
    );
  }
}

export default UsersRoute;
