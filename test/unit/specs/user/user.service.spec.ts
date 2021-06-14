import Boom from 'boom';

import { LoginReqDto, RegisterUserReqDto } from '@/common/dto';
import { UserRepository } from '@/db/repositories/user.repository';
import { findUserById, login, register } from '@/user/user.service';
import { encryptPassword } from '@/utils/password.utils';

import { mockUser } from '../../utils/fixtures';
import { userMockRepo } from '../../utils/repo.mocks';

describe('User Service', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    UserRepository.getInstance = jest.fn().mockReturnValue(userMockRepo);
  });

  describe('findUserById', () => {
    const dto = new LoginReqDto();
    dto.email = mockUser.email as Email;
    dto.password = mockUser.password!;

    test('should find the user by id correctly', async () => {
      userMockRepo.findByIdOrFail.mockResolvedValueOnce(mockUser);
      expect(await findUserById({ id: mockUser.id })).toMatchObject(mockUser);
    });
  });

  describe('login', () => {
    const dto = new LoginReqDto();
    dto.email = mockUser.email as Email;
    dto.password = mockUser.password!;

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
        password: await encryptPassword(mockUser.password!),
      };
      userMockRepo.findByEmailOrFail!.mockResolvedValueOnce(loginUser);
      expect(await login(dto)).toMatchObject({
        cookie: expect.any(String),
        user: loginUser,
      });
    });
  });

  describe('register', () => {
    const dto = new RegisterUserReqDto();
    dto.firstName = mockUser.firstName!;
    dto.lastName = mockUser.lastName!;
    dto.email = mockUser.email as Email;
    dto.password = mockUser.password!;

    test("should throw if the user's account is already registered", async () => {
      userMockRepo.findByEmail!.mockResolvedValueOnce(mockUser);
      await expect(register(dto)).rejects.toThrowError(
        Boom.conflict('The provided email address is already in use')
      );
    });

    test('should register a user, return a token, and set the cookie correctly', async () => {
      const registeredUser = {
        ...mockUser,
        password: await encryptPassword(mockUser.password!),
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
