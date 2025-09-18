import { User } from 'src/infraestructure/entities/users/user.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IUsersRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

export const IUsersRepositoryToken = 'IUsersRepository';
