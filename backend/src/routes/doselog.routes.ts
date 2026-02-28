import { getDoseLogs, logDose, getAdherenceData, updateDoseLog } from '../controllers/doselog.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import prisma from '../db/prisma.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getDoseLogs(prisma));
router.get('/adherence', getAdherenceData(prisma));
router.post('/', logDose(prisma));
router.put('/:id', updateDoseLog(prisma));

export default router;

