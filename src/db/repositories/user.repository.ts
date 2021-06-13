import Boom from 'boom';
import { Prisma, User } from '@prisma/client';

import { Db } from '@/db';

export class UserRepository {
  create(data: { attributes: Prisma.UserCreateInput }): Promise<User> {
    return Db.prisma.user.create({ data: data.attributes });
  }

  findByEmail(email: Email): Promise<User | null> {
    return Db.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findByEmailOrFail(email: Email): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw Boom.notFound(`User with email ${email} does not exist`);
    }
    return user;
  }

  findById(id: number): Promise<User | null> {
    return Db.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByIdOrFail(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw Boom.notFound(`User with id ${id} does not exist`);
    }
    return user;
  }
}
