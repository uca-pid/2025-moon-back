import { User } from 'src/infraestructure/entities/user/user.entity';
import { JwtPayload } from '../../infraestructure/dtos/shared/jwt-payload.interface';

export interface IJwtService {
  sign(user: User): string;
  verify(token: string): JwtPayload;
}

export const IJwtServiceToken = 'IJwtService';
