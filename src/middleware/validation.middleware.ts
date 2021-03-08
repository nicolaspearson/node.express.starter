import Boom from 'boom';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Creates middleware to validate a request, it triggers a BadRequest error
 * if the request does not pass the given validation.
 *
 * @param dto the dto to validate against.
 * @param message the error message to throw.
 * @param location to location of the object.
 */
export function validationMiddleware(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dto: ClassType<any>,
  message: string,
  location: 'body' | 'params' | 'query' = 'body'
): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const result = await transformAndValidate(dto, req[location], {
        validator: { whitelist: true },
      });
      if (location === 'body') {
        req.body = result;
      }
      next();
    } catch (error) {
      next(Boom.badRequest(message));
    }
  };
}
