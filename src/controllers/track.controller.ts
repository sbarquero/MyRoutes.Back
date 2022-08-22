import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { CreateTrackDto, UpdateTrackDto } from '@/dtos/track.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Track, TrackList } from '@/interfaces/track.interface';
import TrackService from '@/services/track.service';

class TrackController {
  private trackService = new TrackService();

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackList: TrackList[] = await this.trackService.findAll();

      res.status(200).json(trackList);
    } catch (error) {
      next(error);
    }
  };

  public getAllPublic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackList: TrackList[] = await this.trackService.findAllPublic();

      res.status(200).json(trackList);
    } catch (error) {
      next(error);
    }
  };

  public getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const tokenUserId = this.getUserIdFromAuthorizationToken(req);

      if (userId !== tokenUserId) throw new HttpException(401, 'Not authorized');

      const trackList: TrackList[] = await this.trackService.findByUserId(userId);

      res.status(200).json(trackList);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId: string = req.params.id;
      const track: Track = await this.trackService.findById(trackId);
      const tokenUserId = this.getUserIdFromAuthorizationToken(req);

      if (tokenUserId !== track.userId && !track.isPublic)
        throw new HttpException(401, 'Not authorized');

      res.status(200).json(track);
    } catch (error) {
      next(error);
    }
  };

  public getPublicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId: string = req.params.id;
      const track: Track = await this.trackService.findById(trackId);

      if (!track.isPublic) throw new HttpException(401, 'Not authorized');

      res.status(200).json(track);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenUserId = this.getUserIdFromAuthorizationToken(req);

      if (tokenUserId !== req.body.userId)
        throw new HttpException(
          400,
          'The form-data user ID is different that authorization user ID',
        );

      const trackData: CreateTrackDto = {
        ...req.body,
        file: req.file?.buffer,
      };
      const createTrackData: Track = await this.trackService.create(trackData);

      res.status(200).json(createTrackData);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId: string = req.params.id;
      const track: Track = await this.trackService.findById(trackId);
      const tokenUserId = this.getUserIdFromAuthorizationToken(req);

      if (tokenUserId !== track.userId) throw new HttpException(401, 'Not authorized');

      await this.trackService.deleteTrack(trackId);

      res.status(200).json({ message: 'Track deleted' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId: string = req.params.id;
      const track: Track = await this.trackService.findById(trackId);
      const tokenUserId = this.getUserIdFromAuthorizationToken(req);

      if (tokenUserId !== track.userId) throw new HttpException(401, 'Not authorized');

      const userData: UpdateTrackDto = req.body;
      await this.trackService.update(trackId, userData);

      res.status(200).json({ message: 'Track updated' });
    } catch (error) {
      next(error);
    }
  };

  private getUserIdFromAuthorizationToken = (req: Request): string => {
    const authorizationToken = req.header('Authorization')
      ? req.header('Authorization').split('Bearer ')[1]
      : null;

    const decodedToken = jsonwebtoken.decode(authorizationToken) as JwtPayload;
    return decodedToken.id;
  };
}

export default TrackController;
