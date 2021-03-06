import Boom from 'boom';
import * as bcrypt from 'bcrypt';

import LoginUserDto from '@/common/dto/user.login.dto';
import RegisterUserDto from '@/common/dto/user.register.dto';
import CookieUser from '@/common/interfaces/cookie-user';
import Token from '@/common/interfaces/token';
import TokenContents from '@/common/interfaces/token-contents.interface';
import TokenData from '@/common/interfaces/token-data.interface';
import User from '@/db/entities/user.entity';
import UserRepository from '@/db/repositories/user.repository';
import BaseService from '@/services/base.service';

export default class UserService extends BaseService<User> {
  constructor(private userRepository: UserRepository) {
    super(userRepository);
  }

  public preSaveHook(user: User): void {
    // Executed before the save repository call
    delete user.id;
  }

  public preUpdateHook(user: User): void {
    // Executed before the update repository call
    delete user.updatedAt;
  }

  public preDeleteHook(user: User): void {
    // Executed before the delete repository call
    user.deletedAt = new Date();
  }

  public preResultHook(user: User): void {
    // Executed before the result is returned
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete user.password;
  }

  public async register(userData: RegisterUserDto): Promise<CookieUser> {
    if (await this.userRepository.findOne({ emailAddress: userData.emailAddress })) {
      throw Boom.badRequest('That email address is already registered!');
    }
    const hashedPassword = await this.encryptPassword(userData.password);
    const user = await this.userRepository.saveRecord({
      ...userData,
      password: hashedPassword,
    });

    // Create a token for the user
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user: { ...user, password: '' },
    };
  }

  public async login(userData: LoginUserDto): Promise<CookieUser> {
    try {
      let userResult: User;
      try {
        // Fetch the user from the database
        userResult = await this.userRepository.findOneByFilter({
          where: {
            emailAddress: userData.emailAddress,
            enabled: true,
          },
        });
      } catch (error) {
        // User not found / disabled
        throw Boom.unauthorized('Invalid credentials supplied');
      }

      // Validate the provided password
      const valid = await this.validatePassword(userData.password, userResult.password);
      if (!valid) {
        throw Boom.unauthorized('Invalid email address / password supplied');
      }

      // Create a token for the user
      const tokenData = this.createToken(userResult);
      const cookie = this.createCookie(tokenData);
      return {
        cookie,
        user: { ...userResult, password: '' },
      };
    } catch (error) {
      if (error && error.isBoom) {
        throw error;
      }
      throw Boom.internal(error);
    }
  }

  public createToken(user: User): Token {
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

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${String(tokenData.expiresIn!)}`;
  }

  public async encryptPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(dbPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(dbPassword, password);
  }
}
