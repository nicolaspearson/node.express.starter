import Boom from 'boom';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { RequestHandler } from 'express';

function validationMiddleware<T>(type: T, skipMissingProperties = false): RequestHandler {
  return (request, _, next) => {
    validate(plainToClass(type as any, request.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints!))
            .join(';');
          next(Boom.badRequest(message));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
