import Boom from 'boom';
import { getCustomRepository } from 'typeorm';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';
import CookieUser from '@/common/models/cookie-user.model';
import User from '@/db/entities/user.entity';
import UserRepository from '@/db/repositories/user.repository';
import { createCookie } from '@/utils/cookie.utils';
import { encryptPassword, validatePassword } from '@/utils/password.utils';
import { createToken } from '@/utils/token.utils';

export async function login(userLoginDto: UserLoginDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  const user: User = await userRepository.findByEmailOrFail(userLoginDto.emailAddress);
  if (!user.enabled) {
    throw Boom.unauthorized('User account has been disabled');
  }
  // Validate the provided password
  const valid = await validatePassword(userLoginDto.password, user.password);
  if (!valid) {
    throw Boom.unauthorized('Invalid email address or password');
  }
  // Create a token for the user
  const tokenData = createToken(user);
  const cookie = createCookie(tokenData);
  return {
    cookie,
    user,
  };
}

export async function register(userRegisterDto: UserRegisterDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  if (await userRepository.findByEmail(userRegisterDto.emailAddress)) {
    throw Boom.conflict('The provided email address is already in use');
  }
  const hashedPassword = await encryptPassword(userRegisterDto.password);
  const user = await userRepository.create({
    attributes: {
      ...userRegisterDto,
      password: hashedPassword,
    },
  });
  // Create a token for the user
  const tokenData = createToken(user);
  const cookie = createCookie(tokenData);
  return {
    cookie,
    user,
  };
}
