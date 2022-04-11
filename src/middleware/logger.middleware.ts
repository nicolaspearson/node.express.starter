import { NextFunction, Request, Response } from 'express';

import { ewl } from '@/logger';

export function loggerMiddleware(req: Request, _: Response, next: NextFunction): void {
  ewl.debug(`${req.method} ${req.path}`);
  next();
}
