import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', length: 75, unique: true })
  @Index('IDX_USER_EMAIL', { synchronize: false })
  email: string;

  @Column({ name: 'enabled', nullable: false, default: true })
  enabled: boolean;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'password' })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
  deletedAt: Nullable<Date>;
}
