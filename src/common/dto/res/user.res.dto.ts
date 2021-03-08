import { User } from '@/db/entities/user.entity';

export class UserResDto {
  readonly id: number;
  readonly emailAddress: string;
  readonly enabled: boolean;
  readonly firstName: string;
  readonly lastName: string;

  constructor(user: User) {
    this.id = user.id;
    this.emailAddress = user.emailAddress;
    this.enabled = user.enabled;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
