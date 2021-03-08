import { Request, Response } from 'express';

import { logger } from '@/logger';
import { loggerMiddleware } from '@/middleware/logger.middleware';

describe('Logger Middleware', () => {
  test('should log the method and path then call next', () => {
    const mockNext = jest.fn();
    const request = { method: 'POST', path: '/user/login' } as Request;
    loggerMiddleware(request, {} as Response, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
    expect(logger.debug).toBeCalledTimes(1);
    expect(logger.debug).toBeCalledWith(`${request.method} ${request.path}`);
  });
});
