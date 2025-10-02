import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Service } from '../service/service.entity';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

@Entity('appointments')
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'workshop_id' })
  workshop: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Service, { eager: false })
  @JoinTable({
    name: 'appointment_services',
    joinColumn: { name: 'appointment_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;
}
