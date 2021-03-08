import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/common/models/http-exception.model';

export function errorMiddleware(
  error: HttpException,
  _: Request,
  res: Response,
  __: NextFunction
): void {
  let statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';
  if (error && error.output && error.output.statusCode) {
    statusCode = error.output.statusCode;
  }
  if (!Boom.isBoom(error)) {
    error = Boom.boomify(error, { statusCode, message });
  }
  res.status(statusCode).send(error.output.payload);
}
