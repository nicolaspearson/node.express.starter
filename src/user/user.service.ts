import * as Boom from '@hapi/boom';
import { getCustomRepository } from 'typeorm';

import {
  CookieUserResDto,
  FindUserByIdReqDto,
  LoginReqDto,
  RegisterUserReqDto,
} from '@/common/dto';
import { User } from '@/db/entities/user.entity';
import { UserRepository } from '@/db/repositories/user.repository';
import { encryptPassword, validatePassword } from '@/utils/password.utils';

export async function findUserById(findUserByIdReqDto: FindUserByIdReqDto): Promise<User> {
  const userRepository = getCustomRepository(UserRepository);
  return userRepository.findByIdOrFail(Number(findUserByIdReqDto.id));
}

export async function login(loginReqDto: LoginReqDto): Promise<CookieUserResDto> {
  const userRepository = getCustomRepository(UserRepository);
  const user: User = await userRepository.findByEmailOrFail(loginReqDto.email);
  if (!user.enabled) {
    throw Boom.unauthorized('User account has been disabled');
  }
  // Validate the provided password
  const valid = await validatePassword(loginReqDto.password, user.password);
  if (!valid) {
    throw Boom.unauthorized('Invalid email address or password');
  }
  return new CookieUserResDto(user);
}

export async function register(registerUserReqDto: RegisterUserReqDto): Promise<CookieUserResDto> {
  const userRepository = getCustomRepository(UserRepository);
  if (await userRepository.findByEmail(registerUserReqDto.email)) {
    throw Boom.conflict('The provided email address is already in use');
  }
  const hashedPassword = await encryptPassword(registerUserReqDto.password);
  const user = await userRepository.create({
    attributes: {
      ...registerUserReqDto,
      password: hashedPassword,
    },
  });
  return new CookieUserResDto(user);
}
