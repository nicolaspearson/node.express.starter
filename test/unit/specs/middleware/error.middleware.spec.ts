import Boom from 'boom';
import { Request, Response } from 'express';

import { HttpException } from '@/common/models/http-exception.model';
import { errorMiddleware } from '@/middleware/error.middleware';

describe('Error Middleware', () => {
  test('should default to a 500', () => {
    const mockResponse = ({
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    } as unknown) as Response;
    errorMiddleware(new Error() as HttpException, {} as Request, mockResponse, jest.fn());
    expect(mockResponse.status).toBeCalledTimes(1);
    expect(mockResponse.status).toBeCalledWith(500);
  });

  test('should return a 404 correctly', () => {
    const mockResponse = ({
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    } as unknown) as Response;
    const error = new Error('User not found');
    const notFoundException = Boom.boomify(error, { statusCode: 404 });
    errorMiddleware(notFoundException, {} as Request, mockResponse, jest.fn());
    expect(mockResponse.status).toBeCalledTimes(1);
    expect(mockResponse.status).toBeCalledWith(notFoundException.output.statusCode);
  });
});
