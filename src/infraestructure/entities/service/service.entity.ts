import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { User } from '../user/user.entity';
import { ServiceSparePart } from './service-spare-part.entity';
import { ServiceStatusEnum } from './service.enum';

@Entity('services')
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  status: ServiceStatusEnum;

  @ManyToOne(() => User, (user) => user.services)
  mechanic: User;

  @OneToMany(
    () => ServiceSparePart,
    (serviceSparePart) => serviceSparePart.service,
  )
  spareParts: ServiceSparePart[];

  @OneToMany(() => Appointment, (appointment) => appointment.services)
  appointments: Appointment[];
}
