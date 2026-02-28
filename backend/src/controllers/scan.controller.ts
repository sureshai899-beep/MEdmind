import type { Request, Response, NextFunction } from 'express';
import { ocrService } from '../services/ocr.service.js';
import { AppError } from '../middleware/error.middleware.js';
import path from 'path';
import fs from 'fs';

/**
 * Handles image upload and starts OCR processing
 */
export const uploadAndProcess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new AppError('No image file provided', 400));
        }

        const imagePath = req.file.path;

        // Process the image using OCR
        const result = await ocrService.processLabel(imagePath);

        // In a real app, we might want to keep the image or delete it after processing
        // For now, we'll keep it as the frontend might want to show it back

        res.status(200).json({
            status: 'success',
            data: {
                imageId: path.basename(imagePath),
                result
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Processes an already uploaded image (if needed by frontend flow)
 */
export const processImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { imageId } = req.params;
        if (!imageId) {
            return next(new AppError('Image ID is required', 400));
        }
        const imagePath = path.join('uploads', imageId as string);

        if (!fs.existsSync(imagePath)) {
            return next(new AppError('Image not found', 404));
        }

        const result = await ocrService.processLabel(imagePath);

        res.status(200).json({
            status: 'success',
            data: {
                imageId,
                result
            }
        });
    } catch (error) {
        next(error);
    }
};
