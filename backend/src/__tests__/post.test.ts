import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockPrisma } from '../db/singleton.js';
import { createPostWithPrisma, getPostsWithPrisma, uploadPostImageWithPrisma } from '../controllers/post.controller.js';
import type { Request, Response, NextFunction } from 'express';

const mockRequest = (body: any = {}, params: any = {}, user: any = null, query: any = {}, file: any = null) => ({
    body,
    params,
    query,
    user,
    file
} as unknown as Request);

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext = jest.fn() as unknown as NextFunction;

describe('Post Controller Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPostWithPrisma', () => {
        it('should create a new post successfully', async () => {
            const req = mockRequest({
                title: 'Test Post',
                content: 'Test Content'
            }, {}, { id: 'user1' });

            const res = mockResponse();

            const mockPost = {
                id: 'post1',
                title: 'Test Post',
                content: 'Test Content',
                user_id: 'user1',
                image_url: null,
                created_at: new Date()
            };

            mockPrisma.post.create.mockResolvedValue(mockPost);

            const handler = createPostWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { post: mockPost }
            });
        });
    });

    describe('getPostsWithPrisma', () => {
        it('should get posts with pagination', async () => {
            const req = mockRequest({}, {}, null, { page: '1', limit: '2' });
            const res = mockResponse();

            const mockPosts = [
                { id: '1', title: 'A', content: 'A', user_id: 'u1', image_url: null, created_at: new Date() },
                { id: '2', title: 'B', content: 'B', user_id: 'u1', image_url: null, created_at: new Date() }
            ];

            mockPrisma.post.findMany.mockResolvedValue(mockPosts);

            const handler = getPostsWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 2,
                orderBy: { created_at: 'desc' },
                include: { user: { select: { id: true, email: true } } }
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                results: 2,
                data: { posts: mockPosts }
            });
        });
    });

    describe('uploadPostImageWithPrisma', () => {
        it('should upload an image to an existing post', async () => {
            const req = mockRequest({}, { id: 'post1' }, { id: 'user1' }, {}, { filename: 'test-image.jpg' });
            const res = mockResponse();

            const existingPost = {
                id: 'post1',
                title: 'Test Post',
                content: 'Test Content',
                user_id: 'user1',
                image_url: null,
                created_at: new Date()
            };

            const updatedPost = {
                ...existingPost,
                image_url: '/uploads/test-image.jpg'
            };

            mockPrisma.post.findUnique.mockResolvedValue(existingPost);
            mockPrisma.post.update.mockResolvedValue(updatedPost);

            const handler = uploadPostImageWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { post: updatedPost }
            });
        });

        it('should fail if no image is uploaded', async () => {
            const req = mockRequest({}, { id: 'post1' }, { id: 'user1' }); // no file
            const res = mockResponse();

            const handler = uploadPostImageWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as any).mock.calls[0][0];
            expect(errorArg.message).toBe('No image uploaded');
            expect(errorArg.statusCode).toBe(400);
        });

        it('should fail if the post does not belong to the user', async () => {
            const req = mockRequest({}, { id: 'post1' }, { id: 'user2' }, {}, { filename: 'test-image.jpg' });
            const res = mockResponse();

            const existingPost = {
                id: 'post1',
                title: 'Test Post',
                content: 'Test Content',
                user_id: 'user1', // Belongs to user1, request is from user2
                image_url: null,
                created_at: new Date()
            };

            mockPrisma.post.findUnique.mockResolvedValue(existingPost);

            const handler = uploadPostImageWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as any).mock.calls[0][0];
            expect(errorArg.message).toBe('You can only upload images to your own posts');
            expect(errorArg.statusCode).toBe(403);
        });
    });
});
