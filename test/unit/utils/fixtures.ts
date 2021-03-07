import User from '@/db/entities/user.entity';

export const mockUser: User = {
  id: 1,
  firstName: 'Rick',
  lastName: 'Sanchez',
  emailAddress: 'rick.sanchez@example.com',
  password: '123456',
  enabled: true,
};
