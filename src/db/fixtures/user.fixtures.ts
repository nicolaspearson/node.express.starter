import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '@/db/entities/user.entity';

export const userFixtures: QueryDeepPartialEntity<User>[] = [
  {
    id: 1,
    enabled: true,
    email: 'msmith@fixture.example.com' as Email,
    firstName: 'Morty',
    lastName: 'Smith',
    password: 'secret',
  },
];
