import {
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequestDto } from 'src/infraestructure/dtos/shared/authenticated-request.dto';
import {
  type IJwtService,
  IJwtServiceToken,
} from 'src/domain/interfaces/jwt-service.interface';

@Injectable()
export class AuthenticateUserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticateUserMiddleware.name, {
    timestamp: true,
  });

  constructor(
    @Inject(IJwtServiceToken)
    private readonly jwtService: IJwtService,
  ) {}

  use(req: AuthenticatedRequestDto, _: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      this.logger.warn('No token provided, proceeding as unauthenticated');
      // If no token is provided, allow the request to proceed as unauthenticated
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      next();
    } catch (err: unknown) {
      this.logger.warn(
        'Error while validating token',
        (err as Error)?.message || err,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
