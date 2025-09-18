import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequestDto } from 'src/infraestructure/dtos/shared/authenticated-request.dto';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequestDto>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return user;
  },
);
