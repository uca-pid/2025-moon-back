import { User } from 'src/infraestructure/entities/user/user.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IUsersRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByIdOrThrow(id: number): Promise<User>;
}

export const IUsersRepositoryToken = 'IUsersRepository';
