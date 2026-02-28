import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter.js';

export const getProfileWithPrisma = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                profile_picture_url: true,
                age: true,
                weight: true,
                weight_unit: true,
                allergies: true,
                chronic_conditions: true,
                created_at: true
            },
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user: toCamelCase(user) },
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfileWithPrisma = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        const updates = toSnakeCase(req.body);

        const user = await prisma.user.update({
            where: { id: userId },
            data: updates,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                profile_picture_url: true,
                age: true,
                weight: true,
                weight_unit: true,
                allergies: true,
                chronic_conditions: true
            },
        });

        res.status(200).json({
            status: 'success',
            data: { user: toCamelCase(user) },
        });
    } catch (error) {
        next(error);
    }
};

export const uploadAvatarWithPrisma = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        if (!req.file) {
            return next(new AppError('No image uploaded', 400));
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { profile_picture_url: imageUrl },
            select: { id: true, email: true, profile_picture_url: true },
        });

        res.status(200).json({
            status: 'success',
            data: { user: toCamelCase(user) },
        });
    } catch (error) {
        next(error);
    }
};

