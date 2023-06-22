import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { SECRET_KEY } from '@/config';

export const getUserIdFromAuthorizationToken = (req: Request): string => {
  const authorizationToken = req.header('Authorization')
    ? req.header('Authorization').split('Bearer ')[1]
    : null;

  const decodedToken = jsonwebtoken.verify(authorizationToken, SECRET_KEY) as JwtPayload;
  return decodedToken.id;
};
