import { RequestHandler, Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { fileuploadcontroller } from '../utils/Cloudinary';
import { IUser } from '../Interface/user.interface';
import { CookieOptions } from 'express';
import { generateOtp } from '../utils/otp';
import  {sendOtpEmail } from '../utils/nodemailr';


// Helper function to generate refresh and access tokens
const generateRefreshTokenAndAccessToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const generatedRefreshToken = user.generateRefreshToken();
  const generatedAccessToken = user.generateAccessToken();

  user.refreshToken = generatedRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { generatedRefreshToken, generatedAccessToken };
};

// Register a new user
// export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { fullName, email, password } = req.body;
//     console.log(fullName, email, password)
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     const avatar = files.avatar ? files.avatar[0]?.path : undefined;

//     if (![fullName, email, password].every(field => field?.trim())) {
//       throw new ApiError(406, 'All fields are required');
//     }

//     const existByEmail = await User.findOne({ email });

//     if (existByEmail) {
//       throw new ApiError(409, 'User already exists with the email');
//     }

//     let avatarPath = {
//       url: "https://res.cloudinary.com/djjinjn9m/image/upload/v1725405945/dnoh8dcahlc7bzhbpoqy.webp"
//     };

//     if (avatar) {
//       avatarPath = await fileuploadcontroller(avatar);
//       if (!avatarPath) {
//         throw new ApiError(408, "Unable to upload avatar. Please try again");
//       }
//     }
    
//     const otp = generateOtp();

//     const newUser = await User.create({
//       fullName,
//       email,
//       password,
//       avatar: avatarPath?.url,
//       otp,
//       isverifed : false
//     }) as IUser;

//     sendOtpEmail(email, otp);

//     const createdUser : any = await User.findById(newUser._id) as IUser;

//     if (!createdUser) {
//       throw new ApiError(500, 'Something went wrong while creating the user');
//     }
//     const { generatedRefreshToken, generatedAccessToken } = await generateRefreshTokenAndAccessToken(createdUser._id.toString());

//     const loggedInUser = await User.findById(createdUser._id).select('-password -refreshToken -otp') as IUser;

//     const cookieOptions = {
//       httpOnly: true,
//       secure: true // Set secure cookie flag based on environment
//     };

//     res.status(201) // Changed status code to 200 for successful login
//       .cookie('refreshToken', generatedRefreshToken, cookieOptions)
//       .cookie('accessToken', generatedAccessToken, cookieOptions)
//       .json(new ApiResponse(201, {
//         user: loggedInUser,
//       }, 'User registered successfully'));

//   } catch (error) {
//     next(error);
//   }
// };

export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password); // Consider removing or masking sensitive info in production

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatar = files.avatar ? files.avatar[0]?.path : undefined;

    if (![fullName, email, password].every(field => field?.trim())) {
      throw new ApiError(406, 'All fields are required');
    }

    const existByEmail = await User.findOne({ email });
    if (existByEmail) {
      throw new ApiError(409, 'User already exists with the email');
    }

    let avatarPath = {
      url: "https://res.cloudinary.com/djjinjn9m/image/upload/v1725405945/dnoh8dcahlc7bzhbpoqy.webp"
    };

    if (avatar) {
      avatarPath = await fileuploadcontroller(avatar);
      if (!avatarPath) {
        throw new ApiError(408, "Unable to upload avatar. Please try again");
      }
    }

    const otp = generateOtp();

    const newUser = await User.create({
      fullName,
      email,
      password,
      avatar: avatarPath?.url,
      otp,
      isVerified: false // Initially set to false
    }) as IUser;

    sendOtpEmail(email, otp);
    const user = await User.findById(newUser._id).select('-password -refreshToken -otp') as IUser;

    // Respond with status indicating that OTP has been sent
    res.status(200).json(new ApiResponse(200, user, 'User registered successfully. Please verify your email with the OTP sent.'));

  } catch (error) {
    next(error);
  }
};

export const verifyOtp: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    console.log(typeof(otp))

    // Find the user by email and check OTP
    const user = await User.findOne({ email }) as IUser;
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    console.log(typeof(user.otp))

    if (user.otp !== otp) {
      throw new ApiError(400, 'Invalid OTP');
    }

    // OTP is valid, update user to set isVerified to true
    user.isverified = true;
    user.otp = 'hsdhjihhjhj'; // Clear OTP after verification
    await user.save();

    // Generate tokens
    const { generatedRefreshToken, generatedAccessToken } = await generateRefreshTokenAndAccessToken(user._id.toString());

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken -otp') as IUser;

    const cookieOptions = {
      httpOnly: true,
      secure: true // Set secure cookie flag based on environment
    };

    res.status(201) // Changed status code to 200 for successful login
      .cookie('refreshToken', generatedRefreshToken, cookieOptions)
      .cookie('accessToken', generatedAccessToken, cookieOptions)
      .json(new ApiResponse(201, {
        user: loggedInUser,
      }, 'User registered successfully'));
    

  } catch (error) {
    next(error);
  }
};



// Login a user
export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new ApiError(400, 'Email and Password are required');
    }

    const user : any = await User.findOne({ email }) as IUser; // Type assertion
    if (!user) {
      throw new ApiError(404, 'User not found, please sign up');
    }

    const correctPassword = await user.isPasswordCorrect(password);
    if (!correctPassword) {
      throw new ApiError(401, 'Incorrect password, please enter the correct password');
    }

    const userId = user._id.toString(); // Ensure _id is treated as a string
    const { generatedRefreshToken, generatedAccessToken } = await generateRefreshTokenAndAccessToken(userId);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken -otp') as IUser;

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' // or 'none' if cross-site cookies are needed
    };

    res.status(200) // Changed status code to 200 for successful login
      .cookie('refreshToken', generatedRefreshToken, cookieOptions)
      .cookie('accessToken', generatedAccessToken, cookieOptions)
      .json(new ApiResponse(200, {
        user: loggedInUser,
      }, 'User logged in successfully'));
  } catch (error) {
    next(error);
  }
};



export const getuser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser; // TypeScript knows req.user is of type IUser

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
  } catch (error) {
    next(error);
  }
};


// Logout a user
// export const logout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Ensure req.user and req.user._id are defined
//     if (!req.user || !req.user._id) {
//       return res.status(400).json(new ApiResponse(400, {}, 'User not authenticated'));
//     }

//     // Update the user's document to unset the refreshToken
//     await User.findByIdAndUpdate(
//       req.user._id,
//       { $unset: { refreshToken: '' } },
//       { new: true }
//     );

//     // Define cookie options
//     const options = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // Only set secure in production
//     };

//     // Clear cookies and send response
//     res.status(202)
//       .clearCookie('accessToken', options)
//       .clearCookie('refreshToken', options)
//       .json(new ApiResponse(202, {}, 'User logged out'));
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };