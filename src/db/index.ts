import { PrismaClient } from '@prisma/client';

import { UserRepository } from '@/db/repositories/user.repository';

export class Db {
  public static prisma: PrismaClient;
  public static userRepository: UserRepository;

  constructor() {
    Db.prisma = new PrismaClient();
    Db.userRepository = new UserRepository();
  }
}
