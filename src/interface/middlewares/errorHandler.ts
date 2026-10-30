import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Middleware global de manejo de errores.
 * - Oculta stack traces en producción.
 * - Captura errores de Prisma y los traduce a respuestas HTTP amigables.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  // --- Errores de Prisma ---
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          message: 'Ya existe un registro con ese valor único.',
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado.',
        });
        return;
      default:
        res.status(500).json({
          success: false,
          message: 'Error de base de datos.',
        });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos.',
    });
    return;
  }

  // --- Errores de aplicación (con status personalizado) ---
  const status: number = err.status ?? 500;
  const message: string = err.message ?? 'Error interno del servidor.';

  // Solo mostrar stack trace en desarrollo
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(status).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
}
