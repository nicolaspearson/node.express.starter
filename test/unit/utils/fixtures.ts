import { User } from '@/db/entities/user.entity';

export const newDate = new Date();

export const mockUser: User = {
  id: 1,
  firstName: 'Rick',
  lastName: 'Sanchez',
  emailAddress: 'rick.sanchez@example.com',
  password: '123456',
  enabled: true,
  createdAt: newDate,
  updatedAt: newDate,
  deletedAt: null,
};
