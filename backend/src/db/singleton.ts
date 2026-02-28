import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';
import { jest } from '@jest/globals';

// Create a deep mock of the PrismaClient
export const prismaMock = mockDeep<PrismaClient>();

// This tells Jest to use our mocked client whenever '../db/prisma.js' or './prisma.js' is imported
jest.unstable_mockModule('./prisma.js', () => ({
    __esModule: true,
    default: prismaMock,
}));

// Provide a type-safe reference for tests to use
export const mockPrisma = prismaMock as unknown as DeepMockProxy<PrismaClient>;
