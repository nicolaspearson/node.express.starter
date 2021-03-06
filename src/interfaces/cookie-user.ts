import User from '@/entities/user.entity';

export default interface CookieUser {
  cookie: string;
  user: User;
}
