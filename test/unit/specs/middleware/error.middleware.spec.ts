import Boom from 'boom';
import { Request, Response } from 'express';

import { HttpException } from '@/common/models/http-exception.model';
import { errorMiddleware } from '@/middleware/error.middleware';

const mockNext = jest.fn();
const mockSend = jest.fn();
const mockStatus = jest.fn(() => ({
  send: mockSend,
}));
const mockResponse = ({
  status: mockStatus,
} as unknown) as Response;

describe('Error Middleware', () => {
  beforeEach(jest.clearAllMocks);

  test('should default to a 500', () => {
    errorMiddleware(new Error() as HttpException, {} as Request, mockResponse, mockNext);
    expect(mockResponse.status).toBeCalledTimes(1);
    expect(mockResponse.status).toBeCalledWith(500);
  });

  test('should return a 404 correctly', () => {
    const error = new Error('User not found');
    const notFoundException = Boom.boomify(error, { statusCode: 404 });
    errorMiddleware(notFoundException, {} as Request, mockResponse, mockNext);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledWith(notFoundException.output.statusCode);
    expect(mockSend).toBeCalledTimes(1);
    expect(mockSend).toBeCalledWith(notFoundException.output.payload);
  });
});
