import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from '../../application/services/index.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body as { name: string; email: string; password: string };

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'name, email y password son requeridos.' });
        return;
      }

      const result = await this.authService.register(name, email, password);

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'email y password son requeridos.' });
        return;
      }

      const result = await this.authService.login(email, password);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
