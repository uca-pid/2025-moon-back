import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { authenticatedUser } from './authenticated-user.decorator';

describe('AuthenticatedUser Decorator', () => {
  const mockUser = { id: 1, name: 'Test User' };
  const noUser = undefined;

  const createContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return the user if authenticated', () => {
    expect(authenticatedUser(null, createContext(mockUser))).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if user is not authenticated', () => {
    expect(() => authenticatedUser(null, createContext(noUser))).toThrow(
      UnauthorizedException,
    );
  });
});
