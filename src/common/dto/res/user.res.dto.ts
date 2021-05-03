import { UserInstance } from '@/db/models/user.model';

export class UserResDto {
  readonly id: number;
  readonly email: Email;
  readonly enabled: boolean;
  readonly firstName: string;
  readonly lastName: string;

  constructor(user: UserInstance) {
    this.id = user.id;
    this.email = user.email as Email;
    this.enabled = user.enabled;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
