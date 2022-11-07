import { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken /*, RequestWithUser*/ } from '@interfaces/auth.interface';
import userModel from '@/models/user.model';

const authMiddleware = (rol = 'user' as string | 'admin' | 'user'): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationToken = req.header('Authorization')
        ? req.header('Authorization').split('Bearer ')[1]
        : null;

      if (!authorizationToken)
        next(new HttpException(404, 'Authentication token not found'));

      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        authorizationToken,
        secretKey,
      )) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await userModel.findById(userId);

      if (!findUser || (findUser.rol !== rol && findUser.rol !== 'admin')) {
        next(new HttpException(401, 'Wrong authentication token'));
      } else {
        next();
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
};

export default authMiddleware;
