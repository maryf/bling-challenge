import { Router } from 'express';
import { check } from 'express-validator';
import AuthController from '../controllers/auth-controller';
import auth from '../middleware/auth';

const router = Router();

router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('mobile', 'Mobile number is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], AuthController.register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], AuthController.login);

router.post('/verify-otp', [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP is required').not().isEmpty(),
], AuthController.verifyOtp);

router.put('/profile', auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
], AuthController.updateProfile);

router.put('/change-password', [
  check('email', 'Please include a valid email').isEmail(),
  check('otp', 'OTP is required').not().isEmpty(),
  check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 }),
], AuthController.changePassword);

export default router;
