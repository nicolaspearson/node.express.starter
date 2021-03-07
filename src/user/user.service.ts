import Boom from 'boom';
import * as bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';
import CookieUser from '@/common/interfaces/cookie-user';
import Token from '@/common/interfaces/token';
import TokenContents from '@/common/interfaces/token-contents.interface';
import TokenData from '@/common/interfaces/token-data.interface';
import User from '@/db/entities/user.entity';
import UserRepository from '@/db/repositories/user.repository';

export function createCookie(tokenData: TokenData): string {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${String(tokenData.expiresIn!)}`;
}

export function createToken(user: User): Token {
  const expiresIn = 60 * 60; // 1 hour
  const tokenContents: TokenContents = {
    id: user.id,
  };
  // Generate a token
  const token: Token = new Token();
  token.expiresIn = expiresIn;
  token.generateToken(tokenContents);
  return token;
}

export async function encryptPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

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

export function validatePassword(dbPassword: string, password: string): Promise<boolean> {
  return bcrypt.compare(dbPassword, password);
}
