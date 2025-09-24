import { authenticatedUser } from './authenticated-mechanic.decorator';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/infraestructure/entities/user/user-role.enum';

describe('AuthenticatedWorkshop Decorator', () => {
  const mechanicUser = { id: 1, userRole: UserRole.MECHANIC };
  const user = { id: 2, userRole: UserRole.USER };
  const noUser = undefined;

  const createContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return the mechanic user if authenticated and role is MECHANIC', () => {
    expect(authenticatedUser(null, createContext(mechanicUser))).toEqual(
      mechanicUser,
    );
  });

  it('should throw UnauthorizedException if user is not authenticated', () => {
    expect(() => authenticatedUser(null, createContext(noUser))).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user is not a mechanic', () => {
    expect(() => authenticatedUser(null, createContext(user))).toThrow(
      UnauthorizedException,
    );
  });
});
