import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { getAdherenceData } from '../controllers/doselog.controller.js';
import { updateMedication } from '../controllers/medication.controller.js';

describe('Adherence and Conflict Resolution Logic', () => {
    let mockPrisma: any;
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;

    beforeEach(() => {
        mockPrisma = {
            doseLog: {
                findMany: jest.fn()
            },
            medication: {
                findUnique: jest.fn(),
                update: jest.fn()
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('getAdherenceData calculates correct percentage and trend', async () => {
        mockReq = {
            user: { id: 'user-1' },
            query: { days: '7' }
        };

        const now = new Date();
        // Mock current period: 2 taken, 2 missed (50%)
        mockPrisma.doseLog.findMany
            .mockResolvedValueOnce([
                { status: 'Taken', timestamp: now },
                { status: 'Taken', timestamp: now },
                { status: 'Missed', timestamp: now },
                { status: 'Skipped', timestamp: now }
            ])
            // Mock previous period: 1 taken, 3 missed (25%)
            .mockResolvedValueOnce([
                { status: 'Taken', timestamp: now },
                { status: 'Missed', timestamp: now },
                { status: 'Missed', timestamp: now },
                { status: 'Missed', timestamp: now }
            ]);

        const handler = getAdherenceData(mockPrisma);
        await handler(mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                adherence: 50,
                trend: '+25%'
            })
        }));
    });

    test('updateMedication returns 409 on version mismatch', async () => {
        mockReq = {
            user: { id: 'user-1' },
            params: { id: 'med-1' },
            body: { name: 'New Name', version: 1 }
        };

        mockPrisma.medication.findUnique.mockResolvedValue({
            id: 'med-1',
            user_id: 'user-1',
            version: 2 // Current version is newer than request
        });

        const handler = updateMedication(mockPrisma);
        await handler(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'fail',
            message: expect.stringContaining('Conflict')
        }));
    });
});
