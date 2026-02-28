import { Router } from 'express';
import { getProfileWithPrisma, uploadAvatarWithPrisma, updateProfileWithPrisma } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../utils/upload.js';
import prisma from '../db/prisma.js';

const router = Router();

router.get('/', authMiddleware, getProfileWithPrisma(prisma));
router.put('/', authMiddleware, updateProfileWithPrisma(prisma));
router.put('/health', authMiddleware, updateProfileWithPrisma(prisma));
router.put('/preferences', authMiddleware, updateProfileWithPrisma(prisma));
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatarWithPrisma(prisma));


export default router;


