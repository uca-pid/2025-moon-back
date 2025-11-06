import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Goal } from '../entities/goals/goal.entity';
import { IGoalRepository } from './interfaces/goal-repository.interface';
import { CreateGoalDto } from '../dtos/goals/create-goal.dto';
import { GoalDto } from '../dtos/goals/goal.dto';

@Injectable()
export class GoalRepository
  extends Repository<Goal>
  implements IGoalRepository
{
  constructor(private dataSource: DataSource) {
    super(Goal, dataSource.createEntityManager());
  }

  async getGoalsOfMechanic(id: number): Promise<GoalDto[]> {
    const qb = this.createQueryBuilder('goal')
      .select([
        'goal.id',
        'goal.label',
        'goal.type',
        'goal.quantity',
        'goal.startDate',
        'goal.endDate',
      ])
      .where('goal."userId" = :id', { id });

    // Subquery para el WHEN (solo citas completadas en el rango)
    const completedAppointmentsSub = qb
      .subQuery()
      .select('COUNT(*)')
      .from('appointments', 'a')
      .where("a.status = 'COMPLETED'")
      .andWhere('a.workshop = ' + id)
      .andWhere('a.date BETWEEN goal.startDate AND goal.endDate')
      .getQuery();

    // Subquery para el ELSE (citas distintas por servicio en el rango)
    const distinctAppointmentsByServiceSub = qb
      .subQuery()
      .select('COUNT(DISTINCT a2.id)')
      .from('appointment_services', 'aps')
      .innerJoin('appointments', 'a2', 'a2.id = aps.appointment_id')
      .where("a2.status = 'COMPLETED'")
      .andWhere('a2.workshop = ' + id)
      .andWhere('a2.date BETWEEN goal.startDate AND goal.endDate')
      .andWhere('aps.service_id = goal.serviceId')
      .getQuery();

    qb.addSelect(
      `CASE
       WHEN goal.type = 'APPOINTMENTS' THEN (${completedAppointmentsSub})
       ELSE (${distinctAppointmentsByServiceSub})
     END`,
      'actual',
    );

    const raws = await qb.getRawMany();
    const convertDate = (date) =>
      `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    return raws.map((raw) => ({
      id: raw.goal_id,
      label: raw.goal_label,
      type: raw.goal_type,
      quantity: raw.goal_quantity,
      startDate: convertDate(raw.goal_startDate),
      endDate: convertDate(raw.goal_endDate),
      actual: Number(raw.actual),
    }));
  }

  async createGoal(dto: CreateGoalDto, mechanicId: number): Promise<void> {
    await this.save({
      ...dto,
      user: { id: mechanicId },
      service: dto.serviceId ? { id: dto.serviceId } : undefined,
    });
  }
}
