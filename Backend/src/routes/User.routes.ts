import { Router } from 'express';
import upload from '../middleware/multer.middleware';
import { register, login, getuser, verifyOtp } from '../controllers/User.register';
import {verifyJWT} from '../middleware/verifyJWT.middleware'

const router = Router();

router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 }
  ]),
  register
);

router.route('/login').post(login);
router.route('/verifyotp').post(verifyOtp);
router.route('/userdata').post(verifyJWT, getuser)
// router.route('/logout').post(logout);

export default router;