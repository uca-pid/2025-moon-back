import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { IJwtService } from 'src/domain/interfaces/jwt-service.interface';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly configService: ConfigService) {}

  public sign(payload: JwtPayload): string {
    return sign(payload, this.configService.getOrThrow<string>('JWT_SECRET'), {
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    });
  }

  public verify(token: string): JwtPayload {
    try {
      return verify(
        token,
        this.configService.getOrThrow<string>('JWT_SECRET'),
      ) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido o no proporcionado');
    }
  }
}
