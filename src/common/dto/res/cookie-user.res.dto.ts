import { User } from '@/db/entities/user.entity';
import { createCookie } from '@/utils/cookie.utils';
import { generateJwtTokens } from '@/utils/jwt.utils';

export class CookieUserResDto {
  readonly cookie: Cookie;
  readonly user: User;

  constructor(user: User) {
    const jwtTokens = generateJwtTokens({ id: user.id });
    const cookie = createCookie(jwtTokens);
    return {
      cookie,
      user,
    };
  }
}
