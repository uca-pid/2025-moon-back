import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequestDto } from 'src/infraestructure/dtos/shared/authenticated-request.dto';
import { UserRole } from 'src/infraestructure/entities/user/user-role.enum';

export const AuthenticatedMechanic = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequestDto>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    if ((user.userRole as UserRole) !== UserRole.MECHANIC) {
      throw new UnauthorizedException('User is not a mechanic');
    }
    return user;
  },
);
