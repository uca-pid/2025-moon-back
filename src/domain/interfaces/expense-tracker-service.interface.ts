import { JwtPayload } from '../dtos/jwt-payload.interface';
import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';

export interface OutcomeEntry {
  sparePart: SparePart;
  quantity: number;
  price: number;
}

export interface IExpenseTrackerService {
  trackIncome(incomeAmount: number): Promise<void>;
  trackOutcome(entries: OutcomeEntry[], mechanic: JwtPayload): Promise<void>;
}

export const IExpenseTrackerServiceToken = 'ExpenseTrackerService';
