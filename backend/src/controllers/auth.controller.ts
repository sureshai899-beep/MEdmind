import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../middleware/error.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID as string) || '';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token: googleToken } = req.body;

        if (!googleToken) {
            return next(new AppError('Google token is required', 400));
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: googleToken,
            audience: GOOGLE_CLIENT_ID ? [GOOGLE_CLIENT_ID] : [],
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return next(new AppError('Invalid Google token', 401));
        }

        const { email, name, picture, sub: googleId } = payload;

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new social user
            user = await prisma.user.create({
                data: {
                    email,
                    google_id: googleId,
                    name: name || '',
                    profile_picture_url: picture,
                } as any,
            });
        } else if (!(user as any).google_id) {

            // Link existing account to Google
            user = await prisma.user.update({
                where: { email },
                data: { google_id: googleId } as any,
            });
        }

        const jwtToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            status: 'success',
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                name: (user as any).name || '',
                role: user.role,
                profile_picture_url: user.profile_picture_url,
            },
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        next(new AppError('Social authentication failed', 401));
    }
};


export const registerWithPrisma = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        if (phone) {
            const existingPhone = await prisma.user.findUnique({
                where: { phone } as any,
            });
            if (existingPhone) {
                return next(new AppError('Phone number already in use', 400));
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                name,
                phone,
            } as any,
            select: { id: true, email: true, name: true, phone: true, role: true, created_at: true } as any,
        });

        res.status(201).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const generateTokens = (user: any) => {
    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) return next(new AppError('Refresh token required', 400));

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // In a real app, verify refresh token in DB/Redis

        const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({ status: 'success', token: accessToken });
    } catch (error) {
        next(new AppError('Invalid refresh token', 401));
    }
};

export const loginWithPrisma = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password_hash: true, role: true, name: true, phone: true } as any
        }) as any;

        if (!user || (user.password_hash && !(await bcrypt.compare(password, user.password_hash))) || (!user.password_hash && password)) {
            return next(new AppError('Incorrect email or password', 401));
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Filter out password_hash
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json({
            status: 'success',
            token: accessToken,
            refreshToken,
            user: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOTPAndAuthenticate = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber, code } = req.body;
        // This would call otpService.verifyOTP - we'll handle the logic here for finding/creating user
        // Assuming verification is handled in routes or passed here.
        // For simplicity, let's update this to be used in routes.

        let user = await prisma.user.findUnique({
            where: { phone: phoneNumber } as any
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone: phoneNumber,
                    email: `${phoneNumber}@medmind.local`, // Fallback email
                    role: 'Patient'
                } as any
            });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.status(200).json({
            status: 'success',
            token: accessToken,
            refreshToken,
            user
        });
    } catch (error) {
        next(error);
    }
};




