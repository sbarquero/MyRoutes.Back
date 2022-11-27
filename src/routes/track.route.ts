import { Router } from 'express';

import { CreateTrackDto, UpdateTrackDto } from '@/dtos/track.dto';
import { Routes } from '@interfaces/routes.interface';
import { uploadFileToMemory } from '@/middlewares/file.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import TrackController from '@/controllers/track.controller';
import validationMiddleware from '@/middlewares/validation.middleware';

class TrackRoute implements Routes {
  public path = '/track';
  public router = Router();
  public trackController = new TrackController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/`,
      authMiddleware('admin'),
      this.trackController.getAll,
    );
    this.router.get(`${this.path}/public`, this.trackController.getAllPublic);
    this.router.get(`${this.path}/public/:id`, this.trackController.getPublicById);
    this.router.get(
      `${this.path}/user/:id`,
      authMiddleware('user'),
      this.trackController.getByUserId,
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware('user'),
      this.trackController.getById,
    );
    this.router.post(
      `${this.path}`,
      authMiddleware('user'),
      uploadFileToMemory(),
      validationMiddleware(CreateTrackDto, 'body'),
      this.trackController.create,
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware('user'),
      validationMiddleware(UpdateTrackDto, 'body'),
      this.trackController.update,
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware('user'),
      this.trackController.delete,
    );
  }
}

export default TrackRoute;
