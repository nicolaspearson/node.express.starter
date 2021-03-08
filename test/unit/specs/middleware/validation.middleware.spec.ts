import Boom from 'boom';
import { Request, Response } from 'express';

import { FindUserByIdReqDto, LoginReqDto } from '@/common/dto';
import { validationMiddleware } from '@/middleware/validation.middleware';

describe('Validation Middleware', () => {
  test('should call next if the body is valid', async () => {
    const mockNext = jest.fn();
    const middleware = validationMiddleware(LoginReqDto, 'Invalid email address or password');
    await middleware(
      { body: { emailAddress: 'test@example.com', password: '123456' } } as Request,
      {} as Response,
      mockNext
    );
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
  });

  test('should call next with an error if body invalid', async () => {
    const mockNext = jest.fn();
    const middleware = validationMiddleware(LoginReqDto, 'Invalid email address or password');
    await middleware(
      { body: { emailAddress: 'not-a-valid-email-address', password: '123456' } } as Request,
      {} as Response,
      mockNext
    );
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith(Boom.badRequest('Invalid email address or password', []));
  });

  test('should call next if query params are valid', async () => {
    const mockNext = jest.fn();
    const middleware = validationMiddleware(FindUserByIdReqDto, 'Invalid id provided', 'params');
    await middleware(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { params: { id: 1 } as any } as Request,
      {} as Response,
      mockNext
    );
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
  });
});
