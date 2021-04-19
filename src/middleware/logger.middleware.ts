import { NextFunction, Request, Response } from 'express';

import { logger } from '@/logger';

export function loggerMiddleware(req: Request, _: Response, next: NextFunction): void {
  logger.debug(`${req.method} ${req.path}`);
  next();
}
