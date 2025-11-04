import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { ReviewEnum, SubCategroriesEnum } from './review.enum';
import { Appointment } from '../appointment/appointment.entity';

@Entity('user_reviews')
export class UserReview {
  @Column()
  userId: number;

  @Column()
  mechanicId: number;

  @PrimaryColumn()
  appointmentId: number;

  @ManyToOne(() => Appointment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mechanicId' })
  mechanic: User;

  @Column({
    type: 'enum',
    enum: ReviewEnum,
    default: ReviewEnum.PENDING,
  })
  review: ReviewEnum;

  @Column({
    type: 'enum',
    enum: SubCategroriesEnum,
    array: true,
    nullable: true,
  })
  subCategories?: SubCategroriesEnum[] | null;
}
