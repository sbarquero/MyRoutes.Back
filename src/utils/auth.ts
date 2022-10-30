import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

export const getUserIdFromAuthorizationToken = (req: Request): string => {
  const authorizationToken = req.header('Authorization')
    ? req.header('Authorization').split('Bearer ')[1]
    : null;

  const decodedToken = jsonwebtoken.decode(authorizationToken) as JwtPayload;
  return decodedToken.id;
};
