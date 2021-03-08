import Boom from 'boom';
import { getCustomRepository } from 'typeorm';

import { LoginReqDto, RegisterUserReqDto } from '@/common/dto';
import { CookieUser } from '@/common/models/cookie-user.model';
import { User } from '@/db/entities/user.entity';
import { UserRepository } from '@/db/repositories/user.repository';
import { createCookie } from '@/utils/cookie.utils';
import { encryptPassword, validatePassword } from '@/utils/password.utils';
import { createTokenPayload } from '@/utils/token.utils';

export async function login(loginReqDto: LoginReqDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  const user: User = await userRepository.findByEmailOrFail(loginReqDto.emailAddress);
  if (!user.enabled) {
    throw Boom.unauthorized('User account has been disabled');
  }
  // Validate the provided password
  const valid = await validatePassword(loginReqDto.password, user.password);
  if (!valid) {
    throw Boom.unauthorized('Invalid email address or password');
  }
  // Create a token for the user
  const tokenPayload = createTokenPayload(user);
  const cookie = createCookie(tokenPayload);
  return {
    cookie,
    user,
  };
}

export async function register(registerUserReqDto: RegisterUserReqDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  if (await userRepository.findByEmail(registerUserReqDto.emailAddress)) {
    throw Boom.conflict('The provided email address is already in use');
  }
  const hashedPassword = await encryptPassword(registerUserReqDto.password);
  const user = await userRepository.create({
    attributes: {
      ...registerUserReqDto,
      password: hashedPassword,
    },
  });
  // Create a token for the user
  const tokenPayload = createTokenPayload(user);
  const cookie = createCookie(tokenPayload);
  return {
    cookie,
    user,
  };
}
