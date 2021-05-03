import Boom from 'boom';

import {
  CookieUserResDto,
  FindUserByIdReqDto,
  LoginReqDto,
  RegisterUserReqDto,
} from '@/common/dto';
import { User, UserInstance } from '@/db/models/user.model';
import { encryptPassword, validatePassword } from '@/utils/password.utils';

async function findByIdOrFail(id: string | number): Promise<UserInstance> {
  const user = await User.findByPk(Number(id));
  if (!user) {
    throw Boom.notFound(`User with id: ${id} does not exist!`);
  }
  return user;
}

async function findByEmail(email: Email): Promise<UserInstance | null> {
  return User.findOne({
    where: {
      email,
    },
  });
}

async function findByEmailOrFail(email: Email): Promise<UserInstance> {
  const user = await findByEmail(email);
  if (!user) {
    throw Boom.notFound(`User with email: ${email} does not exist!`);
  }
  return user;
}

export async function findUserById(findUserByIdReqDto: FindUserByIdReqDto): Promise<UserInstance> {
  return findByIdOrFail(findUserByIdReqDto.id);
}

export async function login(loginReqDto: LoginReqDto): Promise<CookieUserResDto> {
  const user = await findByEmailOrFail(loginReqDto.email);
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
  if (await findByEmail(registerUserReqDto.email)) {
    throw Boom.conflict('The provided email address is already in use');
  }
  const hashedPassword = await encryptPassword(registerUserReqDto.password);
  const user = await User.create({
    ...registerUserReqDto,
    enabled: true,
    password: hashedPassword,
  });
  return new CookieUserResDto(user);
}
