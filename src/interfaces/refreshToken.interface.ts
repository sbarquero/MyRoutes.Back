export interface RefreshToken {
  session: string;
  token: string;
  expireAt: Date;
}
