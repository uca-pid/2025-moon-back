import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { AuthenticateUserMiddleware } from './authenticate-user.middleware';
import {
  IJwtService,
  IJwtServiceToken,
} from 'src/domain/interfaces/jwt-service.interface';
import { UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';

describe('AuthenticateUserMiddleware', () => {
  let middleware: AuthenticateUserMiddleware;
  let jwtServiceMock: MockProxy<IJwtService>;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    jwtServiceMock = mockDeep<IJwtService>();
    next = jest.fn();
    res = {} as Response;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserMiddleware,
        { provide: IJwtServiceToken, useValue: jwtServiceMock },
      ],
    }).compile();

    middleware = module.get<AuthenticateUserMiddleware>(
      AuthenticateUserMiddleware,
    );
  });

  it('should call next() and not set req.user if no Authorization header', () => {
    const req: any = { headers: {} };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('should call next() and not set req.user if Authorization header is not a string', () => {
    const req: any = { headers: { authorization: 12345 } };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('should call next() and not set req.user if Authorization header does not start with Bearer', () => {
    const req: any = { headers: { authorization: 'Token abcdef' } };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('should verify token and set req.user if valid Bearer token is provided', () => {
    const payload = { userId: 1, email: 'test@example.com' };
    jwtServiceMock.verify.mockReturnValue(payload as any);
    const req: any = { headers: { authorization: 'Bearer validtoken' } };

    middleware.use(req, res, next);

    expect(jwtServiceMock.verify).toHaveBeenCalledWith('validtoken');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    jwtServiceMock.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const req: any = { headers: { authorization: 'Bearer invalidtoken' } };

    expect(() => middleware.use(req, res, next)).toThrow(UnauthorizedException);
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('invalidtoken');
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is expired', () => {
    jwtServiceMock.verify.mockImplementation(() => {
      throw new Error('jwt expired');
    });
    const req: any = { headers: { authorization: 'Bearer expiredtoken' } };

    expect(() => middleware.use(req, res, next)).toThrow(UnauthorizedException);
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('expiredtoken');
    expect(next).not.toHaveBeenCalled();
  });

  it('should not throw if verify returns null (falsy payload)', () => {
    jwtServiceMock.verify.mockReturnValue(null as any);
    const req: any = { headers: { authorization: 'Bearer sometoken' } };
    middleware.use(req, res, next);
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('sometoken');
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('should not set req.user if headers.authorization is undefined', () => {
    const req: any = { headers: { authorization: undefined } };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });
});
