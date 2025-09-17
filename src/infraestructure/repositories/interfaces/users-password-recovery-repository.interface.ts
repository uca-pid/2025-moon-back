import { IBaseRepository } from './base-repository.interface';
import { UserPasswordRecovery } from 'src/infraestructure/entities/users/password-recovery.entity';

export interface IUsersPasswordRecoveryRepository
  extends IBaseRepository<UserPasswordRecovery> {
  findValidToken(
    token: string,
    email: string,
  ): Promise<UserPasswordRecovery | null>;

  markAsUsed(entity: UserPasswordRecovery): Promise<UserPasswordRecovery>;
}

export const IUsersPasswordRecoveryRepositoryToken =
  'IUsersPasswordRecoveryRepository';
