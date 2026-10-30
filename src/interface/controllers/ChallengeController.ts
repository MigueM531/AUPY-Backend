import type { Request, Response, NextFunction } from 'express';
import type { ChallengeService } from '../../application/services/index.js';

export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

      const result = await this.challengeService.getAll(page, limit);

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challenge = await this.challengeService.getById(req.params.id as string);

      res.status(200).json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challenge = await this.challengeService.create(req.body);

      res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challenge = await this.challengeService.update(req.params.id as string, req.body);

      res.status(200).json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.challengeService.delete(req.params.id as string);

      res.status(200).json({ success: true, message: 'Challenge eliminado correctamente.' });
    } catch (error) {
      next(error);
    }
  };
}
