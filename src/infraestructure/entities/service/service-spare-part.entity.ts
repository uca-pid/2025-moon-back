import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { SparePart } from '../spare-part/spare-part.entity';
import { Service } from './service.entity';

@Entity('services_spare_parts')
export class ServiceSparePart extends BaseEntity {
  @PrimaryColumn()
  serviceId: number;

  @PrimaryColumn()
  sparePartId: number;

  @ManyToOne(() => Service, (service) => service.spareParts)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => SparePart, (sparePart) => sparePart.serviceSpareParts)
  @JoinColumn({ name: 'sparePartId' })
  sparePart: SparePart;

  @Column()
  quantity: number;
}
