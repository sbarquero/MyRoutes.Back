import { model, Schema, Document } from 'mongoose';

import { ResetToken } from '@interfaces/resetToken.interface';

const resetTokenSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: false,
  },
});

const resetTokenModel = model<ResetToken & Document>('ResetToken', resetTokenSchema);

export default resetTokenModel;
