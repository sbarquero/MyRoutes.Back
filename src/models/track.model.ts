import { model, Schema, Document } from 'mongoose';

import { Track } from '@/interfaces/track.interface';

const trackSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false,
  },
  geojsonData: {
    type: Object,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
  },
  uploadAt: {
    type: Date,
    required: false,
  },
  updateAt: {
    type: Date,
    required: false,
  },
});

const trackModel = model<Track & Document>('Track', trackSchema);

export default trackModel;
