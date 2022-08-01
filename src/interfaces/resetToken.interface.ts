export interface ResetToken {
  _id: string;
  email: string;
  token: string;
  expireAt: Date;
}
