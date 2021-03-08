import { NextFunction, Request, Response } from 'express';

import { getJwtFromRequest } from '@/utils/jwt.utils';
import { getTokenStringFromRequest } from '@/utils/token.utils';

export function authMiddleware(req: Request, _: Response, next: NextFunction): void {
  req.tokenString = getTokenStringFromRequest(req);
  req.jwt = getJwtFromRequest(req.tokenString!);
  next();
}
