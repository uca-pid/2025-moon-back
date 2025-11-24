import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import {
  IExpenseTrackerService,
  OutcomeEntry,
} from 'src/domain/interfaces/expense-tracker-service.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpendeeExpenseTrackerService implements IExpenseTrackerService {
  private url: string;
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.url = this.config.getOrThrow('SPENDEE_BASE_URL');
  }

  async trackIncome(incomeAmount: number) {
    const url = `${this.url}/ingreso`;
    const data = { ingreso: incomeAmount };
    await firstValueFrom(this.http.post(url, data));
  }

  async trackOutcome(
    entries: OutcomeEntry[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mechanic: JwtPayload,
  ): Promise<void> {
    const url = `${this.url}/gasto`;
    for (const entry of entries) {
      const data = {
        gasto: entry.price * entry.quantity,
        categoryName: entry.sparePart.name,
      };
      await firstValueFrom(this.http.post(url, data));
    }
  }
}
