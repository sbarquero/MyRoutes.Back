import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/user.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  sessions: {
    type: [
      {
        refreshToken: {
          type: String,
          required: true,
        },
        createAt: {
          type: Date,
          required: true,
        },
        expireAt: {
          type: Date,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
  createAt: {
    type: Date,
    required: false,
  },
  updateAt: {
    type: Date,
    required: false,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
