import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.route) {
    const error = Boom.notFound('The requested route does not exist');
    res.status(error.output.statusCode).send(error.output.payload);
  } else {
    next();
  }
}
