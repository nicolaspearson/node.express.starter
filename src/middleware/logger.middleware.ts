import { NextFunction, Request, Response } from 'express';

import { logger } from '@/logger';

export function loggerMiddleware(request: Request, _: Response, next: NextFunction): void {
  logger.debug(`${request.method} ${request.path}`);
  next();
}
