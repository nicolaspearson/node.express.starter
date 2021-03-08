import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'email_address', length: 500 })
  public emailAddress: string;

  @Column({ name: 'enabled', nullable: false, default: true })
  public enabled: boolean;

  @Column({ name: 'first_name', length: 500 })
  public firstName: string;

  @Column({ name: 'last_name', length: 500 })
  public lastName: string;

  @Column({ name: 'password', length: 500 })
  public password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  public updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
  public deletedAt: Nullable<Date>;
}
