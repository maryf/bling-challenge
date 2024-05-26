import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AuthService from '../services/auth-service';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, mobile, password } = req.body;

    try {
      const token = await AuthService.register(name, email, mobile, password);
      res.json({ token });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      await AuthService.login(email, password);
      res.json({ msg: 'OTP sent to your mobile number' });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, otp } = req.body;

    try {
      const token = await AuthService.verifyOtp(email, otp);
      res.json({ token });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email } = req.body;

    try {
      const user = await AuthService.updateProfile(req.body.user.id, name, email);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, otp, newPassword } = req.body;

    try {
      await AuthService.changePassword(email, otp, newPassword);
      res.json({ msg: 'Password changed successfully' });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }
}

export default new AuthController();