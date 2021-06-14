import Boom from 'boom';
import { User } from '@prisma/client';

import {
  CookieUserResDto,
  FindUserByIdReqDto,
  LoginReqDto,
  RegisterUserReqDto,
} from '@/common/dto';
import { UserRepository } from '@/db/repositories/user.repository';
import { encryptPassword, validatePassword } from '@/utils/password.utils';

export async function findUserById(findUserByIdReqDto: FindUserByIdReqDto): Promise<User> {
  return UserRepository.getInstance().findByIdOrFail(Number(findUserByIdReqDto.id));
}

export async function login(loginReqDto: LoginReqDto): Promise<CookieUserResDto> {
  const user: User = await UserRepository.getInstance().findByEmailOrFail(loginReqDto.email);
  if (!user.enabled) {
    throw Boom.unauthorized('User account has been disabled');
  }
  // Validate the provided password
  const valid = await validatePassword(loginReqDto.password, user.password!);
  if (!valid) {
    throw Boom.unauthorized('Invalid email address or password');
  }
  return new CookieUserResDto(user);
}

export async function register(registerUserReqDto: RegisterUserReqDto): Promise<CookieUserResDto> {
  if (await UserRepository.getInstance().findByEmail(registerUserReqDto.email)) {
    throw Boom.conflict('The provided email address is already in use');
  }
  const hashedPassword = await encryptPassword(registerUserReqDto.password);
  const user = await UserRepository.getInstance().create({
    attributes: {
      ...registerUserReqDto,
      password: hashedPassword,
    },
  });
  return new CookieUserResDto(user);
}
