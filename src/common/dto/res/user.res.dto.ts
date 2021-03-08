import { User } from '@/db/entities/user.entity';

export class UserResDto {
  readonly id: number;
  readonly email: Email;
  readonly enabled: boolean;
  readonly firstName: string;
  readonly lastName: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email as Email;
    this.enabled = user.enabled;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
