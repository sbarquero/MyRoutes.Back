import { NextFunction, Request, Response } from 'express';
import { Track, TrackList } from '@/interfaces/track.interface';
import TrackService from '@/services/track.service';
import { CreateTrackDto } from '@/dtos/track.dto';

class TrackController {
  public trackService = new TrackService();

  public getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
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

      res.status(200).json(track);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackData: CreateTrackDto = req.body;
      const createTrackData: Track = await this.trackService.create(trackData);

      res.status(200).json(createTrackData);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId: string = req.params.id;
      await this.trackService.deleteTrack(trackId);

      res.status(200).json({ message: 'Track deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TrackController;
