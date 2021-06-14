import { PrismaClient } from '@prisma/client';
import { MockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import { DbClient } from '@/db/client';

DbClient.instance = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockPrisma);
});

export const mockPrisma = DbClient.instance as unknown as MockProxy<PrismaClient>;
