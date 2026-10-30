import { Router } from 'express';
import { SubmissionController } from '../controllers/SubmissionController.js';
import { SubmissionService } from '../../application/services/index.js';
import { PrismaSubmissionRepository, PrismaChallengeRepository } from '../../infrastructure/repositories/index.js';
import { authMiddleware, roleMiddleware } from '../middlewares/index.js';

const router = Router();

// --- Inyección de Dependencias (manual) ---
const submissionRepo = new PrismaSubmissionRepository();
const challengeRepo = new PrismaChallengeRepository();
const submissionService = new SubmissionService(submissionRepo, challengeRepo);
const submissionController = new SubmissionController(submissionService);

// --- Todas las rutas requieren autenticación ---
router.use(authMiddleware);

// --- Rutas del usuario autenticado ---
router.post('/', submissionController.submit);
router.get('/mias', submissionController.getMine);

// --- Ruta solo ADMIN ---
router.get('/', roleMiddleware('ADMIN'), submissionController.getAll);

export default router;
