import { UserRepository } from '@/db/repositories/user.repository';

import { mockUser } from './fixtures';

export const userMockRepo: Mock<UserRepository> = {
  create: jest.fn().mockResolvedValue(mockUser),
  findByEmail: jest.fn().mockResolvedValue(mockUser),
  findByEmailOrFail: jest.fn().mockResolvedValue(mockUser),
  findById: jest.fn().mockResolvedValue(mockUser),
  findByIdOrFail: jest.fn().mockResolvedValue(mockUser),
};
