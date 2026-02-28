import { Router } from 'express';
import { searchDrugs, getDrugDetails, checkInteractions } from '../controllers/drug.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/search', searchDrugs);
router.get('/:id', getDrugDetails);
router.post('/interactions', checkInteractions);

export default router;
