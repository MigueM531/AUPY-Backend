import { Router } from 'express';
import authRoutes from './auth.routes.js';
import challengeRoutes from './challenge.routes.js';
import submissionRoutes from './submission.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/challenges', challengeRoutes);
router.use('/submissions', submissionRoutes);

export default router;
