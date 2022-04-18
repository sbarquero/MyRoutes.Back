import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string;
  name: string;
  email: string;
  rol: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
