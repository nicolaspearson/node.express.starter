import Boom from 'boom';

import UserLoginDto from '@/common/dto/user.login.dto';
import UserRegisterDto from '@/common/dto/user.register.dto';
import { login, register } from '@/user/user.service';
import { createCookie } from '@/utils/cookie.utils';
import { encryptPassword } from '@/utils/password.utils';

import { mockUser } from '../../utils/fixtures';
import { userMockRepo } from '../../utils/repo.mocks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const typeorm = require('typeorm');
typeorm.getCustomRepository = () => userMockRepo;

describe('User Service', () => {
  describe('createCookie', () => {
    const tokenData: Api.TokenData = {
      token: 'token',
      expiresIn: 1,
    };
    test('should return a string when creating a cookie', () => {
      expect(typeof createCookie(tokenData)).toEqual('string');
    });
  });

  describe('login', () => {
    const dto = new UserLoginDto();
    dto.emailAddress = mockUser.emailAddress;
    dto.password = mockUser.password;

    test("should throw if the user's account is not enabled", async () => {
      userMockRepo.findByEmailOrFail!.mockResolvedValueOnce({ ...mockUser, enabled: false });
      await expect(login(dto)).rejects.toThrowError(
        Boom.unauthorized('User account has been disabled')
      );
    });

    test("should throw if the user's password is incorrect", async () => {
      userMockRepo.findByEmailOrFail!.mockResolvedValueOnce({
        ...mockUser,
        password: 'this-is-the-wrong-password',
      });
      await expect(login(dto)).rejects.toThrowError(
        Boom.unauthorized('Invalid email address or password')
      );
    });

    test('should create a token, and set the cookie correctly', async () => {
      const loginUser = {
        ...mockUser,
        password: await encryptPassword(mockUser.password),
      };
      userMockRepo.findByEmailOrFail!.mockResolvedValueOnce(loginUser);
      expect(await login(dto)).toMatchObject({
        cookie: expect.any(String),
        user: loginUser,
      });
    });
  });

  describe('register', () => {
    const dto = new UserRegisterDto();
    dto.firstName = mockUser.firstName;
    dto.lastName = mockUser.lastName;
    dto.emailAddress = mockUser.emailAddress;
    dto.password = mockUser.password;

    test("should throw if the user's account is already registered", async () => {
      userMockRepo.findByEmail!.mockResolvedValueOnce(mockUser);
      await expect(register(dto)).rejects.toThrowError(
        Boom.conflict('The provided email address is already in use')
      );
    });

    test('should register a user, return a token, and set the cookie correctly', async () => {
      const registeredUser = {
        ...mockUser,
        password: await encryptPassword(mockUser.password),
      };
      userMockRepo.findByEmail!.mockResolvedValueOnce(undefined);
      userMockRepo.create!.mockResolvedValueOnce(registeredUser);
      expect(await register(dto)).toMatchObject({
        cookie: expect.any(String),
        user: registeredUser,
      });
    });
  });
});
