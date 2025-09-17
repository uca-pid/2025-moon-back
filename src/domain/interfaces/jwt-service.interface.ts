import { JwtPayload } from '../dtos/jwt-payload.interface';

export interface IJwtService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}

export const IJwtServiceToken = 'IJwtService';
