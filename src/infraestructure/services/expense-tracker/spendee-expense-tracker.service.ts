import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  async trackIncome(incomeAmount: number, token: string) {
    const url = `${this.url}/api/ingreso`;
    const data = { ingreso: incomeAmount };
    await firstValueFrom(
      this.http.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
  }

  async trackOutcome(entries: OutcomeEntry[], token: string): Promise<void> {
    const url = `${this.url}/api/gasto`;
    for (const entry of entries) {
      const data = {
        gasto: entry.price * entry.quantity,
        categoryName: entry.sparePart.name,
      };
      await firstValueFrom(
        this.http.post(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
    }
  }

  async fetchToken(code: string): Promise<[string, string]> {
    const url = `${this.url}/oauth/token`;
    const response = await firstValueFrom(this.http.post(url, { code }));
    const { access_token, refresh_token } = response.data;
    return [access_token, refresh_token];
  }

  async refreshToken(refreshToken: string): Promise<[string, string]> {
    const url = `${this.url}/oauth/refresh`;
    const response = await firstValueFrom(
      this.http.post(url, { refresh_token: refreshToken }),
    );
    const { access_token, refresh_token } = response.data;
    return [access_token, refresh_token];
  }
}
