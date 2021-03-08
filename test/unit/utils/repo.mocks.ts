import { getCustomRepository as gcr } from 'typeorm';

import { UserRepository } from '@/db/repositories/user.repository';

import { mockUser } from './fixtures';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCustomRepository: typeof gcr & jest.Mock = gcr as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userMockManager = { getCustomRepository } as any;

export const userMockRepo: Mock<UserRepository> = {
  create: jest.fn().mockResolvedValue(mockUser),
  findByEmail: jest.fn().mockResolvedValue(mockUser),
  findByEmailOrFail: jest.fn().mockResolvedValue(mockUser),
  findById: jest.fn().mockResolvedValue(mockUser),
  findByIdOrFail: jest.fn().mockResolvedValue(mockUser),
  getManager: jest.fn(() => ({
    transaction: jest.fn(async (cb: (_: unknown) => void) => cb(userMockManager)),
  })),
};
