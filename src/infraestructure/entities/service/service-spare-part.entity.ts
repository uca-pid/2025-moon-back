import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { SparePart } from '../spare-part/spare-part.entity';
import { Service } from './service.entity';

@Entity('services_spare_parts')
export class ServiceSparePart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SparePart, (sparePart) => sparePart.serviceSpareParts)
  sparePart: SparePart;

  @Column()
  quantity: number;

  @ManyToOne(() => Service, (service) => service.spareParts)
  service: Service;
}
