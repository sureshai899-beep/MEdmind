import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Log error (in a real app, use a logger service like Winston)
    console.error(`[Error] ${statusCode} - ${message}`, err.stack);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
