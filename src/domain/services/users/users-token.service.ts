import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { type IUsersTokenService } from 'src/domain/interfaces/users-token-service.interface';
import {
  IUsersTokenRepositoryToken,
  type IUsersTokenRepository,
} from 'src/infraestructure/repositories/interfaces/users-token-repository.interface';
import jwt from 'jsonwebtoken';
import {
  type IExpenseTrackerService,
  IExpenseTrackerServiceToken,
} from 'src/domain/interfaces/expense-tracker-service.interface';

@Injectable()
export class UsersTokenService implements IUsersTokenService {
  constructor(
    @Inject(IUsersTokenRepositoryToken)
    private readonly usersTokenRepository: IUsersTokenRepository,
    @Inject(IExpenseTrackerServiceToken)
    private readonly expenseTrackerService: IExpenseTrackerService,
  ) {}

  async getTokenOrThrow(userId: number) {
    const result = await this.usersTokenRepository.findByUserId(userId);
    if (result === null)
      throw new BadRequestException('user should configure spendee auth');
    const [token, refreshToken] = result;
    if (this.isExpired(token)) return this.renewToken(userId, refreshToken);
    return token;
  }

  private isExpired(token: string): boolean {
    const decoded = jwt.decode(token) as { exp?: number } | null;

    if (!decoded || !decoded.exp) {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp < nowInSeconds;
  }

  private async renewToken(
    userId: number,
    refreshToken: string,
  ): Promise<string> {
    const result = await this.expenseTrackerService.refreshToken(refreshToken);
    await this.usersTokenRepository.upsertToken(userId, result[0], result[1]);
    return result[0];
  }
}
