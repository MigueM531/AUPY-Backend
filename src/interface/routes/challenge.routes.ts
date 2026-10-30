import { Router } from 'express';
import { ChallengeController } from '../controllers/ChallengeController.js';
import { ChallengeService } from '../../application/services/index.js';
import { PrismaChallengeRepository } from '../../infrastructure/repositories/index.js';
import { authMiddleware } from '../middlewares/index.js';
import { roleMiddleware } from '../middlewares/index.js';

const router = Router();

// --- Inyección de Dependencias (manual) ---
const challengeRepo = new PrismaChallengeRepository();
const challengeService = new ChallengeService(challengeRepo);
const challengeController = new ChallengeController(challengeService);

// --- Rutas Públicas ---
router.get('/', challengeController.getAll);
router.get('/:id', challengeController.getById);

// --- Rutas Protegidas (solo ADMIN) ---
router.post('/', authMiddleware, roleMiddleware('ADMIN'), challengeController.create);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), challengeController.update);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), challengeController.delete);

export default router;
