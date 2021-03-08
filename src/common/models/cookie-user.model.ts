import User from '@/db/entities/user.entity';

export default interface CookieUser {
  cookie: string;
  user: User;
}
