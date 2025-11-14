import { Module } from '@nestjs/common';
import { SparePartController } from './spare-part.controller';
import { ISparePartServiceToken } from 'src/domain/interfaces/spare-part-service.interface';
import { SparePartService } from 'src/domain/services/spare-part/spare-part.service';
import { ISparePartRepositoryToken } from 'src/infraestructure/repositories/interfaces/spare-part-repository.interface';
import { SparePartRepository } from 'src/infraestructure/repositories/spare-part.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';
import { ExpenseTrackerModule } from 'src/infraestructure/services/expense-tracker/expense-tracker.module';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart]), ExpenseTrackerModule],
  controllers: [SparePartController],
  providers: [
    { provide: ISparePartServiceToken, useClass: SparePartService },
    { provide: ISparePartRepositoryToken, useClass: SparePartRepository },
  ],
  exports: [ISparePartServiceToken],
})
export class SparePartModule {}
