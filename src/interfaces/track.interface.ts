export interface Track {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createAt: Date;
  updateAt: Date;
  geojsonData: Object;
}

export interface TrackList {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createAt: Date;
  updateAt: Date;
}
