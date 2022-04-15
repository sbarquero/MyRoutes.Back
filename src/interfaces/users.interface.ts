export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  rol: string;
  active: boolean;
  google: boolean;
  createAt: Date;
  updateAt: Date;
}
