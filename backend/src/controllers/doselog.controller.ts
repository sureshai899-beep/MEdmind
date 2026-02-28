import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { toCamelCase, toSnakeCase } from '../utils/caseConverter.js';

export const getDoseLogs = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { medicationId, days } = req.query;

        const where: any = { user_id: userId };
        if (medicationId) where.medication_id = medicationId as string;

        if (days) {
            const dateLimit = new Date();
            dateLimit.setDate(dateLimit.getDate() - parseInt(days as string));
            where.timestamp = { gte: dateLimit };
        }

        const logs = await (prisma as any).doseLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            include: { medication: { select: { name: true } } }
        });

        res.status(200).json({
            status: 'success',
            results: logs.length,
            data: { logs: toCamelCase(logs) },
        });
    } catch (error) {
        next(error);
    }
};

export const getAdherenceData = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const days = parseInt(req.query.days as string) || 7;

        const dateLimit = new Date();
        dateLimit.setHours(0, 0, 0, 0);
        dateLimit.setDate(dateLimit.getDate() - days);

        const logs = await (prisma as any).doseLog.findMany({
            where: {
                user_id: userId,
                timestamp: { gte: dateLimit }
            },
            orderBy: { timestamp: 'asc' }
        });

        // Daily breakdown logic
        const dailyStats: Record<string, { total: number; taken: number }> = {};
        logs.forEach((log: any) => {
            const date = log.timestamp.toISOString().split('T')[0];
            if (!dailyStats[date]) dailyStats[date] = { total: 0, taken: 0 };
            dailyStats[date].total++;
            if (log.status === 'Taken') dailyStats[date].taken++;
        });

        // Calculate current adherence
        const total = logs.length;
        const taken = logs.filter((l: any) => l.status === 'Taken').length;
        const currentAdherence = total > 0 ? Math.round((taken / total) * 100) : 100;

        // Calculate previous period adherence for trend
        const prevDateLimit = new Date(dateLimit);
        prevDateLimit.setDate(prevDateLimit.getDate() - days);

        const prevLogs = await (prisma as any).doseLog.findMany({
            where: {
                user_id: userId,
                timestamp: { gte: prevDateLimit, lt: dateLimit }
            }
        });

        const prevTotal = prevLogs.length;
        const prevTaken = prevLogs.filter((l: any) => l.status === 'Taken').length;
        const prevAdherence = prevTotal > 0 ? Math.round((prevTaken / prevTotal) * 100) : 100;

        const trend = currentAdherence - prevAdherence;

        res.status(200).json({
            status: 'success',
            data: toCamelCase({
                adherence: currentAdherence,
                trend: trend > 0 ? `+${trend}%` : `${trend}%`,
                period: `${days} days`,
                daily: dailyStats,
                stats: {
                    total,
                    taken,
                    missed: logs.filter((l: any) => l.status === 'Missed').length,
                    skipped: logs.filter((l: any) => l.status === 'Skipped').length
                }
            })
        });
    } catch (error) {
        next(error);
    }
};

export const logDose = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new AppError('Unauthorized', 401));

        const { medicationId, status, timestamp } = toCamelCase(req.body); // Use camelCase internally

        // Verify medication exists and belongs to user
        const medication = await (prisma as any).medication.findUnique({
            where: { id: medicationId },
        });

        if (!medication || medication.user_id !== userId) {
            return next(new AppError('Medication not found', 404));
        }

        const log = await (prisma as any).doseLog.create({
            data: {
                user_id: userId,
                medication_id: medicationId,
                status: status || 'Taken',
                timestamp: timestamp ? new Date(timestamp) : new Date(),
            },
            include: { medication: { select: { name: true } } }
        });

        // Optionally decrement pill count if status is 'Taken'
        if (status === 'Taken' && medication.pill_count !== null && medication.pill_count > 0) {
            await (prisma as any).medication.update({
                where: { id: medicationId },
                data: { pill_count: medication.pill_count - 1 },
            });
        }

        res.status(201).json({
            status: 'success',
            data: { log: toCamelCase(log) },
        });
    } catch (error) {
        next(error);
    }
};

export const updateDoseLog = (prisma: PrismaClient) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { status, timestamp } = toSnakeCase(req.body);

        if (!userId) return next(new AppError('Unauthorized', 401));

        // Verify log belongs to user
        const existingLog = await (prisma as any).doseLog.findUnique({
            where: { id },
        });

        if (!existingLog || existingLog.user_id !== userId) {
            return next(new AppError('Dose log not found', 404));
        }

        const log = await (prisma as any).doseLog.update({
            where: { id },
            data: {
                status: status || existingLog.status,
                timestamp: timestamp ? new Date(timestamp) : existingLog.timestamp,
            },
            include: { medication: { select: { name: true } } }
        });

        res.status(200).json({
            status: 'success',
            data: { log: toCamelCase(log) },
        });
    } catch (error) {
        next(error);
    }
};
