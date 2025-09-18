import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/infraestructure/entities/user/user.entity';
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
  async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
