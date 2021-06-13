import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Environment } from '../src/common/enums/environment.enum';
import { encryptPassword } from '../src/utils/password.utils';

async function main() {
  if (process.env.NODE_ENV === Environment.Development) {
    console.debug('Seeding database');
    await prisma.user.upsert({
      where: {
        email: 'msmith@fixture.example.com',
      },
      create: {
        enabled: true,
        email: 'msmith@fixture.example.com',
        firstName: 'Morty',
        lastName: 'Smith',
        password: await encryptPassword('secret'),
      },
      update: {},
    });
  } else {
    console.debug('Seeding skipped');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
