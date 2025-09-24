import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserPasswordRecovery } from 'src/infraestructure/entities/user/password-recovery.entity';
import { IUsersPasswordRecoveryRepository } from './interfaces/users-password-recovery-repository.interface';

@Injectable()
export class UserPasswordRecoveryRepository
  extends Repository<UserPasswordRecovery>
  implements IUsersPasswordRecoveryRepository
{
  constructor(private dataSource: DataSource) {
    super(UserPasswordRecovery, dataSource.createEntityManager());
  }
  findByToken(token: string): Promise<UserPasswordRecovery | null> {
    return this.findOne({ where: { token } });
  }

  async findValidToken(
    token: string,
    email: string,
  ): Promise<UserPasswordRecovery | null> {
    return this.findOne({ where: { token, email, used: false } });
  }

  async markAsUsed(
    entity: UserPasswordRecovery,
  ): Promise<UserPasswordRecovery> {
    entity.used = true;
    return this.save(entity);
  }

  async findLatestUnusedEmail(
    email: string,
  ): Promise<UserPasswordRecovery | null> {
    const results = await this.find({
      where: { email, used: false },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return results.length > 0 ? results[0] : null;
  }
}
