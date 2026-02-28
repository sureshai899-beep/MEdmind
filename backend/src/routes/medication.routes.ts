import { Router } from 'express';
import {
    getMedications,
    getMedication,
    createMedication,
    updateMedication,
    deleteMedication,
    searchMedications
} from '../controllers/medication.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../db/prisma.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMedications(prisma));
router.get('/search', searchMedications);
router.get('/:id', getMedication(prisma));
router.post('/', createMedication(prisma));
router.put('/:id', updateMedication(prisma));
router.delete('/:id', deleteMedication(prisma));


export default router;
