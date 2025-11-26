import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('users_tokens')
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  refreshToken: string;

  @OneToOne(() => User, (user) => user.token)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
