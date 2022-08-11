import { CreateTrackDto } from '@/dtos/track.dto';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from 'class-validator';
import { isValidId } from '@/utils/util';
import { Track, TrackList } from '@/interfaces/track.interface';
import { User } from '@/interfaces/users.interface';
import trackModel from '@/models/track.model';
import userModel from '@/models/users.model';

class TrackService {
  public track = trackModel;
  public users = userModel;

  public async findByUserId(userId: string): Promise<TrackList[]> {
    if (!isValidId(userId)) throw new HttpException(400, 'Invalid user ID format');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(404, 'User ID not found');

    const tracks = await this.track.find({ userId });
    const trackList: TrackList[] = [];

    tracks.forEach(element => {
      const { _id, name, description, userId, isPublic, createAt, updateAt } = element;
      trackList.push({ _id, name, description, userId, isPublic, createAt, updateAt });
    });

    return trackList;
  }

  public async findById(trackId: string): Promise<Track> {
    if (!isValidId(trackId)) throw new HttpException(400, 'Invalid track ID format');

    const findTrack: Track = await this.track.findById(trackId);

    if (!findTrack) throw new HttpException(404, 'Track ID not found');

    return findTrack;
  }

  public async create(trackData: CreateTrackDto): Promise<Track> {
    if (isEmpty(trackData)) throw new HttpException(400, 'There are no data');

    const findUser: User = await this.users.findOne({ _id: trackData.userId });
    if (!findUser) throw new HttpException(404, 'User ID not found');

    const now = new Date();

    const createTrackData: Track = await this.track.create({
      ...trackData,
      createAt: now,
      updateAt: now,
    });

    return createTrackData;
  }

  public async deleteTrack(trackId: string): Promise<Track> {
    if (!isValidId(trackId)) throw new HttpException(400, 'Invalid track ID format');

    const deletedTrackById: Track = await this.track.findByIdAndDelete(trackId);

    if (!deletedTrackById) throw new HttpException(404, `Track not found`);

    return deletedTrackById;
  }
}

export default TrackService;
