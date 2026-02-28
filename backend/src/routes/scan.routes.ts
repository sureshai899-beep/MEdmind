import { Router } from 'express';
import multer from 'multer';
import { uploadAndProcess, processImage } from '../controllers/scan.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import path from 'path';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed') as any, false);
        }
    }
});

router.use(authMiddleware);

// Frontend expects '/scan/upload' and '/scan/process/:imageId'
router.post('/upload', upload.single('file'), uploadAndProcess);
router.post('/process/:imageId', processImage);

export default router;
