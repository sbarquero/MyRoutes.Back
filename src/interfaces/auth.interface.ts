export interface DataStoredInToken {
  id: string;
  name: string;
  email: string;
  rol: string;
}

export interface Session {
  _id?: number;
  refreshToken: string;
  createAt: Date;
  expireAt: Date;
}
