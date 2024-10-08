import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string,
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  otp : string;
  isverified: boolean;
  refreshToken?: string;
  
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
