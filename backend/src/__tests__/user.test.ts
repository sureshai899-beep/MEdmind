import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockPrisma } from '../db/singleton.js';
import { getProfileWithPrisma } from '../controllers/user.controller.js';
import type { Request, Response, NextFunction } from 'express';

const mockRequest = (user: any = null) => ({
    user
} as unknown as Request);

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext = jest.fn() as unknown as NextFunction;

describe('User Controller Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfileWithPrisma', () => {
        it('should fetch the logged-in user profile', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();

            const mockUser = {
                id: '1',
                email: 'user@example.com',
                role: 'USER',
                created_at: new Date()
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

            const handler = getProfileWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                data: { user: mockUser }
            });
        });

        it('should call next with 404 if user not found', async () => {
            const req = mockRequest({ id: '1' });
            const res = mockResponse();

            mockPrisma.user.findUnique.mockResolvedValue(null);

            const handler = getProfileWithPrisma(mockPrisma as any);
            await handler(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            const errorArg = (mockNext as any).mock.calls[0][0];
            expect(errorArg.message).toBe('User not found');
            expect(errorArg.statusCode).toBe(404);
        });
    });
});
