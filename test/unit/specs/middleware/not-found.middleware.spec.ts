import * as Boom from '@hapi/boom';
import { Request, Response } from 'express';

import { notFoundMiddleware } from '@/middleware/not-found.middleware';

const mockNext = jest.fn();
const mockSend = jest.fn();
const mockStatus = jest.fn(() => ({
  send: mockSend,
}));
const mockResponse = {
  status: mockStatus,
} as unknown as Response;

describe('Not Found Middleware', () => {
  beforeEach(jest.clearAllMocks);

  test('should return a 404 correctly', () => {
    const error = Boom.notFound('The requested route does not exist');
    notFoundMiddleware({ route: undefined } as Request, mockResponse, mockNext);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(error.output.statusCode);
    expect(mockSend).toBeCalledTimes(1);
    expect(mockSend).toBeCalledWith(error.output.payload);
  });

  test('should call next', () => {
    notFoundMiddleware({ route: 'test-route' } as Request, mockResponse, mockNext);
    expect(mockNext).toBeCalledTimes(1);
  });
});
