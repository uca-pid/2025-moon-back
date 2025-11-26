import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserToken } from '../entities/user/user-tokens';
import { IUsersTokenRepository } from './interfaces/users-token-repository.interface';
import { User } from '../entities/user/user.entity';

@Injectable()
export class UsersTokenRepository
  extends Repository<UserToken>
  implements IUsersTokenRepository
{
  constructor(private dataSource: DataSource) {
    super(UserToken, dataSource.createEntityManager());
  }

  async upsertToken(
    workshopId: number,
    token: string,
    refreshToken: string,
  ): Promise<void> {
    let entity = await this.findOneBy({ user: { id: workshopId } });
    if (entity === null) {
      entity = this.create();
      entity.user = new User();
      entity.user.id = workshopId;
    }
    entity.token = token;
    entity.refreshToken = refreshToken;
    await this.save(entity);
  }

  async findByUserId(workshopId: number): Promise<null | [string, string]> {
    const entity = await this.findOneBy({ user: { id: workshopId } });
    if (!entity) return null;
    return [entity?.token, entity?.refreshToken];
  }
}
