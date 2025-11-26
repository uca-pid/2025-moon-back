import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';

export interface OutcomeEntry {
  sparePart: SparePart;
  quantity: number;
  price: number;
}

export interface IExpenseTrackerService {
  trackIncome(incomeAmount: number, token: string): Promise<void>;
  trackOutcome(entries: OutcomeEntry[], token: string): Promise<void>;
  fetchToken(code: string): Promise<[string, string]>;
  refreshToken(refreshToken: string): Promise<[string, string]>;
}

export const IExpenseTrackerServiceToken = 'ExpenseTrackerService';
