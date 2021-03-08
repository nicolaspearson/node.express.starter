import { User } from '@/db/entities/user.entity';

export interface CookieUser {
  cookie: string;
  user: User;
}
