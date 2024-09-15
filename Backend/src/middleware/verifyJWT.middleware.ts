import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { IUser } from '../Interface/user.interface';
import { ApiError } from '../utils/ApiError';

interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

export const verifyJWT = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;


    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

    const user = await User.findById(decodedInfo._id).select('-password -refreshToken -otp') as IUser;

    if (!user) {
      throw new ApiError(404, "Invalid access token");
    }

    if(user){
      req.user = <any>user;
   }
    next();
  } catch (err) {
    next(err);
  }
};
