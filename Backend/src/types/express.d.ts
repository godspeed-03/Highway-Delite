import { IUser } from '../Interface/user.interface'; // Adjust this path according to your project

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // You can make this optional if not all requests will have user attached
    }
  }
}
