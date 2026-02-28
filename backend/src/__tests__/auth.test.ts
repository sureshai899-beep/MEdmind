import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockPrisma } from '../db/singleton.js';
import { registerWithPrisma, loginWithPrisma } from '../controllers/auth.controller.js';
import type { Request, Response, NextFunction } from 'express';

// Helper to mock express Request and Response
const mockRequest = (body = {}, params = {}) => ({
    body,
    params,
} as unknown as Request);

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext = jest.fn() as unknown as NextFunction;

describe('Auth Controller Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerWithPrisma', () => {
        it('should register a new user successfully', async () => {
            const req = mockRequest({
                email: 'test@example.com',
                password: 'password123'
            });
            const res = mockResponse();

            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password_hash: 'hashed',
                role: 'USER',
                profile_picture_url: null,
                created_at: new Date()
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue(mockUser);

            const registerHandler = registerWithPrisma(mockPrisma as any);
            await registerHandler(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { user: mockUser }
            });
        });

        it('should call next with AppError if email is already in use', async () => {
            const req = mockRequest({
                email: 'existing@example.com',
                password: 'password123'
            });
            const res = mockResponse();

            mockPrisma.user.findUnique.mockResolvedValue({ id: '2' } as any);

            const registerHandler = registerWithPrisma(mockPrisma as any);
            await registerHandler(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as any).mock.calls[0][0];
            expect(errorArg.message).toBe('Email already in use');
            expect(errorArg.statusCode).toBe(400);
        });
    });

    describe('loginWithPrisma', () => {
        it('should call next with 401 for invalid credentials', async () => {
            const req = mockRequest({
                email: 'wrong@example.com',
                password: 'password123'
            });
            const res = mockResponse();

            mockPrisma.user.findUnique.mockResolvedValue(null);

            const loginHandler = loginWithPrisma(mockPrisma as any);
            await loginHandler(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as any).mock.calls[0][0];
            expect(errorArg.message).toBe('Incorrect email or password');
            expect(errorArg.statusCode).toBe(401);
        });
    });
});
