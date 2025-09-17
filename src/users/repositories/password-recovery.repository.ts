import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPasswordRecovery } from '../entities/password-recovery.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserPasswordRecoveryRepository extends Repository<UserPasswordRecovery> {
  constructor(private dataSource: DataSource) {
    super(UserPasswordRecovery, dataSource.createEntityManager());
  }

  async createToken(email: string): Promise<UserPasswordRecovery> {
    const token = crypto.randomBytes(32).toString('hex');
    const entity = this.create({ email, token });
    return this.save(entity);
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
