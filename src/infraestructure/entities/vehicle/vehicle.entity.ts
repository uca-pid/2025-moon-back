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

  @Column({ unique: true })
  licensePlate: string;

  @Column()
  model: string;

  @Column()
  year: Number;

  @Column()
  km: Number;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
