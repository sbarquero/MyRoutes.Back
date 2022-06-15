import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken /*, RequestWithUser*/ } from '@interfaces/auth.interface';
import userModel from '@models/users.model';

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.header('Authorization')
      ? req.header('Authorization').split('Bearer ')[1]
      : null;

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey,
      )) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await userModel.findById(userId);

      if (!findUser || findUser.rol !== 'admin') {
        next(new HttpException(401, 'Wrong authentication token'));
      } else {
        // req.user = findUser;
        next();
      }
    } else {
      next(new HttpException(404, 'Authentication token not found'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default adminAuthMiddleware;
