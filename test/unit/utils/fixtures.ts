import { User } from '@/db/entities/user.entity';

export const mockJwtString =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1MjQyODE1LCJleHAiOjE2MTUyNDY0MTV9.jKTluPxezE-r5zPpNU27ONezm7Bcy4Qsi0CIZldeJrY' as JwtString;

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
