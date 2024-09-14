import crypto from 'crypto';

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};
