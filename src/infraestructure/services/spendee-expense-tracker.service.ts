import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import {
  IExpenseTrackerService,
  OutcomeEntry,
} from 'src/domain/interfaces/expense-tracker-service.interface';

@Injectable()
export class SpendeeExpenseTrackerService implements IExpenseTrackerService {
  trackIncome() {
    //TODO
  }
  async trackOutcome(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entries: OutcomeEntry[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mechanic: JwtPayload,
  ): Promise<void> {
    //TODO
  }
}
