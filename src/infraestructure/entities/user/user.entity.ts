import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Appointment } from '../appointment/appointment.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { SparePart } from '../spare-part/spare-part.entity';
import { Service } from '../service/service.entity';
import { Notification } from '../notification/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  hashedPassword: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  userRole: UserRole;

  @Column({ nullable: true })
  workshopName?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, type: 'float' })
  addressLatitude?: number;

  @Column({ nullable: true, type: 'float' })
  addressLongitude?: number;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  @OneToMany(() => SparePart, (sparePart) => sparePart.mechanic)
  spareParts: SparePart[];

  @OneToMany(() => Service, (service) => service.mechanic)
  services: Service[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
