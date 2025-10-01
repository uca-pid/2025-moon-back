import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { Appointment } from '../appointment/appointment.entity';
import { SparePart } from '../spare-part/spare-part.entity';

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

  @OneToMany(() => SparePart, (sparePart) => sparePart.mechanic)
  spareParts: SparePart[];
}
