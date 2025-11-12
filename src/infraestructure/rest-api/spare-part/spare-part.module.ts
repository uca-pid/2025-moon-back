import { Module } from '@nestjs/common';
import { SparePartController } from './spare-part.controller';
import { ISparePartServiceToken } from 'src/domain/interfaces/spare-part-service.interface';
import { SparePartService } from 'src/domain/services/spare-part/spare-part.service';
import { ISparePartRepositoryToken } from 'src/infraestructure/repositories/interfaces/spare-part-repository.interface';
import { SparePartRepository } from 'src/infraestructure/repositories/spare-part.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';
import { IExpenseTrackerServiceToken } from 'src/domain/interfaces/expense-tracker-service.interface';
import { SpendeeExpenseTrackerService } from 'src/infraestructure/services/spendee-expense-tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart])],
  controllers: [SparePartController],
  providers: [
    { provide: ISparePartServiceToken, useClass: SparePartService },
    { provide: ISparePartRepositoryToken, useClass: SparePartRepository },
    {
      provide: IExpenseTrackerServiceToken,
      useClass: SpendeeExpenseTrackerService,
    },
  ],
  exports: [ISparePartServiceToken],
})
export class SparePartModule {}
