import User from '@/entities/user.entity';
import BaseRepository from '@/repositories/base.repository';

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User.name);
  }
}
