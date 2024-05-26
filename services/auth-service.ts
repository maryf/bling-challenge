import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const prisma = new PrismaClient();
const twilioClient = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export interface JwtPayload {
  user: {
    id: number;
  };
}

class AuthService {
  async register(name: string, email: string, mobile: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
      },
    });

    const payload: JwtPayload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return token;
  }

  async login(email: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid Credentials');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { email },
      data: { otp },
    });

    await twilioClient.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.mobile,
    });
  }

  async verifyOtp(email: string, otp: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    await prisma.user.update({
      where: { email },
      data: { otp: null, isVerified: true },
    });

    const payload: JwtPayload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return token;
  }

  async updateProfile(userId: number, name: string, email: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return updatedUser;
  }

  async changePassword(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otp: null },
    });
  }
}

export default new AuthService();
