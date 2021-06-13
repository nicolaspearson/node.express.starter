import { User } from '@prisma/client';

export class UserResDto {
  readonly id: number;
  readonly email: Email;
  readonly enabled: boolean;
  readonly firstName: string | null;
  readonly lastName: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email as Email;
    this.enabled = user.enabled;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
