import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

export const createPostWithPrisma = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body;
        const userId = (req as any).user.id;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                user_id: userId,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { post },
        });
    } catch (error) {
        next(error);
    }
};

export const getPostsWithPrisma = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, page: pageStr, limit: limitStr } = req.query;
        const page = parseInt(pageStr as string) || 1;
        const limit = parseInt(limitStr as string) || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (category) where.title = { contains: category as string, mode: 'insensitive' }; // Basic filtering

        const posts = await (prisma as any).post.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: { posts },
        });
    } catch (error) {
        next(error);
    }
};

export const uploadPostImageWithPrisma = (prisma: PrismaClient) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        if (!req.file) {
            return next(new AppError('No image uploaded', 400));
        }

        // Verify post belongs to user
        const post = await prisma.post.findUnique({ where: { id: id as string } });

        if (!post) {
            return next(new AppError('Post not found', 404));
        }

        if (post.user_id !== userId) {
            return next(new AppError('You can only upload images to your own posts', 403));
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const updatedPost = await prisma.post.update({
            where: { id: id as string },
            data: { image_url: imageUrl },
        });

        res.status(200).json({
            status: 'success',
            data: { post: updatedPost },
        });
    } catch (error) {
        next(error);
    }
};
