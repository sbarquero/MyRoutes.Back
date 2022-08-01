import { model, Schema, Document } from 'mongoose';
import { RegisterToken } from '@interfaces/registerToken.interface';

const registerTokenSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const registerTokenModel = model<RegisterToken & Document>(
  'RegisterToken',
  registerTokenSchema,
);

export default registerTokenModel;
