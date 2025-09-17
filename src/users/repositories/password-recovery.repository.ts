import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PasswordRecoveryEntity } from '../entities/password-recovery.entity';
import * as crypto from 'crypto';

@Injectable()
export class PasswordRecoveryRepository extends Repository<PasswordRecoveryEntity> {
  constructor(private dataSource: DataSource) {
    super(PasswordRecoveryEntity, dataSource.createEntityManager());
  }

  async createToken(email: string): Promise<PasswordRecoveryEntity> {
    const token = crypto.randomBytes(32).toString('hex');
    const entity = this.create({ email, token });
    return this.save(entity);
  }

  async findValidToken(
    token: string,
    email: string,
  ): Promise<PasswordRecoveryEntity | null> {
    return this.findOne({ where: { token, email, used: false } });
  }

  async markAsUsed(
    entity: PasswordRecoveryEntity,
  ): Promise<PasswordRecoveryEntity> {
    entity.used = true;
    return this.save(entity);
  }
}
