import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoalType } from './goal-type.enum';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';

@Entity('goals')
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ enum: GoalType })
  type: GoalType;

  @ManyToOne(() => Service, (service) => service.goals)
  service?: Service;

  @Column()
  quantity: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.goals)
  user: User;
}
