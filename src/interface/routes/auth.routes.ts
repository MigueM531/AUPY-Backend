import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { AuthService } from '../../application/services/index.js';
import { PrismaUserRepository } from '../../infrastructure/repositories/index.js';

const router = Router();

// --- Inyección de Dependencias (manual) ---
const userRepo = new PrismaUserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

// --- Rutas Públicas ---
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
