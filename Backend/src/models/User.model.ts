import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../Interface/user.interface';


const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, index: true, trim: true },
    email: { type: String, unique: true, lowercase: true, index: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    avatar: { type: String, required: true, trim: true },
    otp : {type :String, trim:true},
    isverified: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function(): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
