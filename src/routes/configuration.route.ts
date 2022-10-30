import { Router } from 'express';

import { Routes } from '@/interfaces/routes.interface';
import { UpdateUserDto } from '@dtos/users.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import ConfigurationController from '@/controllers/configuration.controller';
import validationMiddleware from '@/middlewares/validation.middleware';

class ConfigurationRoute implements Routes {
  public path = '/configuration';
  public router = Router();
  public configurationController = new ConfigurationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id`,
      authMiddleware('user'),
      this.configurationController.getUserById,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware('user'),
      validationMiddleware(UpdateUserDto, 'body', true),
      this.configurationController.updateUser,
    );
  }
}

export default ConfigurationRoute;
