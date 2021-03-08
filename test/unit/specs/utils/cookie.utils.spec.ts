import { createCookie } from '@/utils/cookie.utils';

describe('Cookie Utils', () => {
  describe('createCookie', () => {
    const tokenPayload: Api.TokenPayload = {
      expiresIn: 1,
      tokenString: 'token',
    };
    test('should return a string when creating a cookie', () => {
      expect(typeof createCookie(tokenPayload)).toEqual('string');
    });
  });
});
