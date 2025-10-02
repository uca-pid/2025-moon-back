import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('users_vehicles')
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licensePlate: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  km: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
