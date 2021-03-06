import User from '@/db/entities/user.entity';
import BaseRepository from '@/db/repositories/base.repository';

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User.name);
  }
}
