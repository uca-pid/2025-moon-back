import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { UserRole } from './users/entities/user-role.enum';

export type JwtPayload = {
  id: number;
  email: string;
  fullName: string;
  userRole: UserRole;
  workshopName: string;
  address: string;
};

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  public sign(payload: JwtPayload): string {
    return sign(payload, this.configService.getOrThrow<string>('JWT_SECRET'), {
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    });
  }

  public verifyToken(token: string): JwtPayload {
    try {
      return verify(
        token,
        this.configService.getOrThrow<string>('JWT_SECRET'),
      ) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token invalido o no proporcionado');
    }
  }
}
