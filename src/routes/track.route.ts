import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import TrackController from '@/controllers/track.controller';
import { CreateTrackDto } from '@/dtos/track.dto';
import validationMiddleware from '@/middlewares/validation.middleware';

class TrackRoute implements Routes {
  public path = '/track';
  public router = Router();
  public trackController = new TrackController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/user/:id`, this.trackController.getByUserId);
    this.router.get(`${this.path}/:id`, this.trackController.getById);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateTrackDto, 'body'),
      this.trackController.create,
    );
    this.router.delete(`${this.path}/:id`, this.trackController.delete);
  }
}

export default TrackRoute;
