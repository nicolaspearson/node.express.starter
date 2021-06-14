import Boom from 'boom';

import { UserRepository } from '@/db/repositories/user.repository';

import { mockUser } from '../../utils/fixtures';
import { mockPrisma } from '../../utils/prisma/client';

describe('User Repository', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a user correctly', async () => {
      mockPrisma.user.create.mockResolvedValue(mockUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...newUser } = mockUser;
      expect(await UserRepository.getInstance().create({ attributes: newUser })).toMatchObject(
        mockUser
      );
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
    });
  });

  describe('findByEmail', () => {
    test('should find the user by email correctly', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      expect(await UserRepository.getInstance().findByEmail(mockUser.email as Email)).toMatchObject(
        mockUser
      );
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
    });
  });

  describe('findByEmailOrFail', () => {
    test('should find the user by email correctly', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      expect(
        await UserRepository.getInstance().findByEmailOrFail(mockUser.email as Email)
      ).toMatchObject(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
    });

    test('should throw if the user does not exist', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(
        UserRepository.getInstance().findByEmailOrFail(mockUser.email as Email)
      ).rejects.toThrowError(Boom.notFound(`User with email ${mockUser.email} does not exist`));
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
    });
  });

  describe('findById', () => {
    test('should find the user by id correctly', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      expect(await UserRepository.getInstance().findById(mockUser.id)).toMatchObject(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });
    });
  });

  describe('findByIdOrFail', () => {
    test('should find the user by id correctly', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      expect(await UserRepository.getInstance().findByIdOrFail(mockUser.id)).toMatchObject(
        mockUser
      );
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });
    });

    test('should throw if the user does not exist', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(UserRepository.getInstance().findByIdOrFail(mockUser.id)).rejects.toThrowError(
        Boom.notFound(`User with id ${mockUser.id} does not exist`)
      );
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });
    });
  });
});
