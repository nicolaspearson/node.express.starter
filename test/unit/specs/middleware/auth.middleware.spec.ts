import Boom from 'boom';
import { Request, Response } from 'express';

import { Token } from '@/common/models/token.model';
import { authMiddleware } from '@/middleware/auth.middleware';

import { mockTokenString } from '../../utils/fixtures';

describe('Auth Middleware', () => {
  test('should parse a valid jwt correctly', () => {
    const mockNext = jest.fn();
    const token = new Token();
    token.generateToken({ id: 1 });
    const request = { headers: { authorization: `Bearer ${token.tokenString}` } } as Request;
    authMiddleware(request, {} as Response, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
    expect(request.jwt).toBeDefined();
    expect(request.tokenString).toEqual(token.tokenString);
  });

  test('should throw if the authorization header is missing', () => {
    const mockNext = jest.fn();
    const request = { headers: {} } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Authorization header is missing from the request.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.tokenString).toBeUndefined();
  });

  test('should throw if the authorization header is invalid', () => {
    const mockNext = jest.fn();
    const request = { headers: { authorization: 'invalid' } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.tokenString).toBeUndefined();
  });

  test('should throw if the jwt payload is invalid', () => {
    const mockNext = jest.fn();
    const tokenString =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const request = { headers: { authorization: `Bearer ${tokenString}` } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.tokenString).toEqual(tokenString);
  });

  test('should throw if the jwt has expired', () => {
    const mockNext = jest.fn();
    const request = { headers: { authorization: `Bearer ${mockTokenString}` } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.tokenString).toEqual(mockTokenString);
  });
});
