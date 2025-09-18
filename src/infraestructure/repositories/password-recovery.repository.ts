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
}
