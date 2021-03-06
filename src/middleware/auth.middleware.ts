import { NextFunction, Request, Response } from 'express';

async function authMiddleware(_: Request, __: Response, next: NextFunction): Promise<void> {
  next();
}

export default authMiddleware;
