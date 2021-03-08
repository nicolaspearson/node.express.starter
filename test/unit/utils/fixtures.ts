import { User } from '@/db/entities/user.entity';

export const newDate = new Date();

export const mockUser: User = {
  id: 1,
  email: 'rick.sanchez@example.com' as Email,
  enabled: true,
  firstName: 'Rick',
  lastName: 'Sanchez',
  password: '123456',
  createdAt: newDate,
  updatedAt: newDate,
  deletedAt: null,
};
