import { RefreshToken } from './refreshToken.interface';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  rol: string;
  active: boolean;
  refreshTokens: [RefreshToken];
  createAt: Date;
  updateAt: Date;
}
