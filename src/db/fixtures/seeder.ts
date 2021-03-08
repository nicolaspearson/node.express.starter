import { Connection, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '@/db/entities/user.entity';
import { userFixtures } from '@/db/fixtures/user.fixtures';
import { encryptPassword } from '@/utils/password.utils';

type Entity = ObjectType<Record<string, unknown>>;

interface Fixture {
  entity: Entity;
  values: QueryDeepPartialEntity<Entity>[];
}

const fixtures: Fixture[] = [{ entity: User, values: userFixtures }];

export async function seedDatabase(connection: Connection): Promise<void> {
  for (const fixture of fixtures) {
    if (fixture.entity === User) {
      for (const value of fixture.values) {
        const user = value as User;
        user.password = await encryptPassword(user.password);
      }
    }
    const repository = connection.getRepository(fixture.entity);
    await repository.save(fixture.values);
  }
}
