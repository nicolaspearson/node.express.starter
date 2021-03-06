import Boom from 'boom';
import * as bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';

import LoginUserDto from '@/common/dto/user.login.dto';
import RegisterUserDto from '@/common/dto/user.register.dto';
import CookieUser from '@/common/interfaces/cookie-user';
import Token from '@/common/interfaces/token';
import TokenContents from '@/common/interfaces/token-contents.interface';
import TokenData from '@/common/interfaces/token-data.interface';
import User from '@/db/entities/user.entity';
import UserRepository from '@/db/repositories/user.repository';

function createToken(user: User): Token {
  const expiresIn = 60 * 60; // 1 hour
  const tokenContents: TokenContents = {
    id: user.id,
  };
  // Create a token
  const token: Token = new Token();
  token.expiresIn = expiresIn;
  token.generateToken(tokenContents);
  return token;
}

function createCookie(tokenData: TokenData): string {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${String(tokenData.expiresIn!)}`;
}

async function encryptPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function validatePassword(dbPassword: string, password: string): Promise<boolean> {
  return bcrypt.compare(dbPassword, password);
}

export async function login(loginUserDto: LoginUserDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  const user: User = await userRepository.findByEmailOrFail(loginUserDto.emailAddress);
  if (!user.enabled) {
    throw Boom.unauthorized('User account has been disabled');
  }

  // Validate the provided password
  const valid = await validatePassword(loginUserDto.password, user.password);
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

export async function register(registerUserDto: RegisterUserDto): Promise<CookieUser> {
  const userRepository = getCustomRepository(UserRepository);
  if (await userRepository.findByEmail(registerUserDto.emailAddress)) {
    throw Boom.badRequest('The provided email address is already in registered');
  }
  const hashedPassword = await encryptPassword(registerUserDto.password);
  const user = await userRepository.create({
    attributes: {
      ...registerUserDto,
      password: hashedPassword,
    },
  });

  // Create a token for the user
  const tokenData = createToken(user);
  const cookie = createCookie(tokenData);
  return {
    cookie,
    user: { ...user, password: '' },
  };
}
