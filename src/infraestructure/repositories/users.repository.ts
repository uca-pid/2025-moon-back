import { Injectable } from '@nestjs/common';
import { User } from 'src/infraestructure/entities/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { IUsersRepository } from './interfaces/users-repository.interface';

@Injectable()
export class UsersRepository
  extends Repository<User>
  implements IUsersRepository
{
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
