import { Router } from 'express';
import { createPostWithPrisma, getPostsWithPrisma, uploadPostImageWithPrisma } from '../controllers/post.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema } from '../schemas/post.schema.js';
import { upload } from '../utils/upload.js';
import prisma from '../db/prisma.js';

const router = Router();

router.get('/', authMiddleware, getPostsWithPrisma(prisma));
router.post('/', authMiddleware, validate(createPostSchema), createPostWithPrisma(prisma));
router.post('/:id/image', authMiddleware, upload.single('image'), uploadPostImageWithPrisma(prisma));

export default router;
