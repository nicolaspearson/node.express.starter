import { createCookie } from '@/utils/cookie.utils';

import { mockJwtString } from '../../utils/fixtures';

describe('Cookie Utils', () => {
  describe('createCookie', () => {
    const jwtTokens: Api.JwtTokens = {
      accessToken: {
        jwtString: mockJwtString,
        options: {
          expiresIn: 1,
        },
      },
    };

    test('should return a string when creating a cookie', () => {
      const cookie = createCookie(jwtTokens);
      expect(typeof cookie).toEqual('string');
      expect(cookie.includes('Authorization')).toBeTruthy();
      expect(cookie.includes('HttpOnly')).toBeTruthy();
      expect(cookie.includes('Max-Age')).toBeTruthy();
      expect(cookie.includes('secure')).toBeTruthy();
    });
  });
});
