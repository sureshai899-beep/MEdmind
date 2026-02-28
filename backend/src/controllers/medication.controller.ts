import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter.js';

export const getMedications = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        const medications = await prisma.medication.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });

        res.status(200).json({
            status: 'success',
            results: medications.length,
            data: { medications: toCamelCase(medications) },
        });
    } catch (error) {
        next(error);
    }
};

export const getMedication = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const medication = await prisma.medication.findUnique({
            where: { id },
        });

        if (!medication || medication.user_id !== userId) {
            return next(new AppError('Medication not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { medication: toCamelCase(medication) },
        });
    } catch (error) {
        next(error);
    }
};

export const createMedication = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        const medData = toSnakeCase(req.body);

        const medication = await prisma.medication.create({
            data: {
                ...medData,
                user_id: userId,
            },
        });

        res.status(201).json({
            status: 'success',
            data: { medication: toCamelCase(medication) },
        });
    } catch (error) {
        next(error);
    }
};

export const updateMedication = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { version, ...updates } = toSnakeCase(req.body);

        // Verify ownership and version
        const existingMed = await prisma.medication.findUnique({ where: { id } });
        if (!existingMed || existingMed.user_id !== userId) {
            return next(new AppError('Medication not found', 404));
        }

        // Conflict check
        if (version !== undefined && existingMed.version !== version) {
            return res.status(409).json({
                status: 'fail',
                message: 'Conflict: Medication has been updated on another device. Please refresh.',
                data: { currentVersion: existingMed.version }
            });
        }

        const medication = await prisma.medication.update({
            where: { id },
            data: {
                ...updates,
                version: existingMed.version + 1
            },
        });

        res.status(200).json({
            status: 'success',
            data: { medication: toCamelCase(medication) },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMedication = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Verify ownership
        const existingMed = await prisma.medication.findUnique({ where: { id } });
        if (!existingMed || existingMed.user_id !== userId) {
            return next(new AppError('Medication not found', 404));
        }

        await prisma.medication.delete({
            where: { id },
        });

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

import { drugService } from '../services/drug.service.js';

export const searchMedications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = typeof req.query.q === 'string' ? req.query.q : '';
        const results = await drugService.searchDrugs(query);

        res.status(200).json({
            status: 'success',
            data: toCamelCase(results)
        });
    } catch (error) {
        next(error);
    }
};
