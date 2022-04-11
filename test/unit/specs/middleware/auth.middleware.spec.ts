import * as Boom from '@hapi/boom';
import { Request, Response } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { generateJwtTokens } from '@/utils/jwt.utils';

import { mockJwtString } from '../../utils/fixtures';

describe('Auth Middleware', () => {
  test('should parse a valid jwt correctly', () => {
    const mockNext = jest.fn();
    const jwtTokens = generateJwtTokens({ id: 1 });
    const request = {
      headers: { authorization: `Bearer ${jwtTokens.accessToken.jwtString}` },
    } as Request;
    authMiddleware(request, {} as Response, mockNext);
    expect(mockNext).toBeCalledTimes(1);
    expect(mockNext).toBeCalledWith();
    expect(request.jwt).toBeDefined();
    expect(request.jwtString).toEqual(jwtTokens.accessToken.jwtString);
  });

  test('should throw if the authorization header is missing', () => {
    const mockNext = jest.fn();
    const request = { headers: {} } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Authorization header is missing from the request.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.jwtString).toBeUndefined();
  });

  test('should throw if the authorization header is invalid', () => {
    const mockNext = jest.fn();
    const request = { headers: { authorization: 'invalid' } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.jwtString).toBeUndefined();
  });

  test('should throw if the jwt payload is invalid', () => {
    const mockNext = jest.fn();
    const jwtString =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' as JwtString;
    const request = { headers: { authorization: `Bearer ${jwtString}` } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.jwtString).toEqual(jwtString);
  });

  test('should throw if the jwt has expired', () => {
    const mockNext = jest.fn();
    const request = { headers: { authorization: `Bearer ${mockJwtString}` } } as Request;
    expect(() => authMiddleware(request, {} as Response, mockNext)).toThrowError(
      Boom.unauthorized('Invalid jwt provided.')
    );
    expect(mockNext).not.toBeCalled();
    expect(request.jwt).toBeUndefined();
    expect(request.jwtString).toEqual(mockJwtString);
  });
});
