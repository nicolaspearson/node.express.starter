import { UserInstance } from '@/db/models/user.model';
import { createCookie } from '@/utils/cookie.utils';
import { generateJwtTokens } from '@/utils/jwt.utils';

export class CookieUserResDto {
  readonly cookie: Cookie;
  readonly user: UserInstance;

  constructor(user: UserInstance) {
    const jwtTokens = generateJwtTokens({ id: user.id });
    const cookie = createCookie(jwtTokens);
    return {
      cookie,
      user,
    };
  }
}
