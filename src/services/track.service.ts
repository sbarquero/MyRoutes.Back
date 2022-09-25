import { DOMParser } from 'xmldom';
import * as tj from '@tmcw/togeojson';

import { CreateTrackDto, UpdateTrackDto } from '@/dtos/track.dto';
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

  public async findAll(): Promise<TrackList[]> {
    const tracks = await this.track
      .find()
      .collation({ locale: 'es' })
      .sort({ name: 'asc' });
    const trackList = [] as TrackList[];

    tracks.forEach(element => {
      const {
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      } = element;

      const track: TrackList = {
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      };

      trackList.push(track);
    });

    return trackList;
  }

  public async findAllPublic(): Promise<TrackList[]> {
    const tracks = await this.track
      .find({ isPublic: true })
      .collation({ locale: 'es' })
      .sort({ name: 'asc' });
    const trackList = [] as TrackList[];

    tracks.forEach(element => {
      const {
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      } = element;

      const track: TrackList = {
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      };

      trackList.push(track);
    });

    return trackList;
  }

  public async findByUserId(userId: string): Promise<TrackList[]> {
    if (!isValidId(userId)) throw new HttpException(400, 'Invalid user ID format');

    const tracks = await this.track
      .find({ $or: [{ userId }, { isPublic: true }] })
      .collation({ locale: 'es' })
      .sort({ name: 'asc' });
    const trackList: TrackList[] = [];

    tracks.forEach(element => {
      const {
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      } = element;
      trackList.push({
        _id,
        name,
        description,
        userId,
        isPublic,
        fileName,
        createAt,
        uploadAt,
        updateAt,
      });
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

    if (!trackData.file) throw new HttpException(400, 'File is required');

    const findUser: User = await this.users.findOne({ _id: trackData.userId });
    if (!findUser) throw new HttpException(404, 'User ID not found');

    const now = new Date();

    const geojson = this.getGeojsonFromKML(trackData.file);

    const createTrackData: Track = await this.track.create({
      ...trackData,
      geojsonData: geojson,
      uploadAt: now,
      updateAt: now,
    });
    return createTrackData;
  }

  public async update(trackId: string, trackData: UpdateTrackDto): Promise<Track> {
    if (!isValidId(trackId)) throw new HttpException(400, 'Invalid track ID format');

    if (isEmpty(trackData)) throw new HttpException(400, 'There are no data');

    const findTrack: Track = await this.track.findById(trackId);
    if (!findTrack) throw new HttpException(404, 'Track ID not found');

    const now = new Date();
    await this.track.findByIdAndUpdate(trackId, { ...trackData, updateAt: now });

    const updatedTrack: Track = await this.users.findById(trackId);

    return updatedTrack;
  }

  public async deleteTrack(trackId: string): Promise<Track> {
    if (!isValidId(trackId)) throw new HttpException(400, 'Invalid track ID format');

    const deletedTrackById: Track = await this.track.findByIdAndDelete(trackId);

    if (!deletedTrackById) throw new HttpException(404, `Track not found`);

    return deletedTrackById;
  }

  private getGeojsonFromKML(kmlFile: Buffer) {
    const kml = new DOMParser().parseFromString(kmlFile.toString());
    const geojson = tj.kml(kml);
    return geojson;
  }

  private getPropertiesFromGeojson(geojson, geometryType: string) {
    const features = geojson.features;
    const f = features.find(feature => feature.geometry.type == geometryType);
    return f.properties;
  }
}

export default TrackService;
