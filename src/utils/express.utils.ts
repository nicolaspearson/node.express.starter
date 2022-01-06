import express from 'express';

import { logger } from '@/logger';

/**
 * Create a new function that passes any error to the next function.
 *
 * @param handler The original express handler that has to be safeguarded.
 * @returns The arrow function that wraps the given express handler.
 */
export function safe(
  handler: express.Handler
): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Using async/await and try/catch supports also handlers that are synchronous
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error((error as Error).message);
      next(error);
    }
  };
}
