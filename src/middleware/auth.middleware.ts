import { NextFunction, Request, Response } from 'express';

import { getJwtFromRequest } from '@/utils/jwt.utils';
import { getJwtStringFromRequest } from '@/utils/jwt.utils';

export function authMiddleware(req: Request, _: Response, next: NextFunction): void {
  req.jwtString = getJwtStringFromRequest(req);
  req.jwt = getJwtFromRequest(req.jwtString!);
  next();
}
