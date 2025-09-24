import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { UserRole } from '../entities/user/user-role.enum';

describe('JwtService', () => {
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    fullName: 'Test User',
    address: '123 Main St',
    addressLatitude: 10.123,
    addressLongitude: 20.456,
    userRole: UserRole.USER,
    workshopName: 'Test Workshop',
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();

    const configServiceMock = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        if (key === 'JWT_EXPIRES_IN') return '1h';
        throw new Error(`Missing config key: ${key}`);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('should sign a user and return a JWT token', () => {
    const token = jwtService.sign(mockUser);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT format
  });

  it('should verify a valid JWT token and return the payload', () => {
    const token = jwtService.sign(mockUser);
    const payload = jwtService.verify(token);
    expect(payload).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      fullName: mockUser.fullName,
      address: mockUser.address,
      addressLatitude: mockUser.addressLatitude,
      addressLongitude: mockUser.addressLongitude,
      userRole: mockUser.userRole,
      workshopName: mockUser.workshopName,
    });
  });

  it('should throw UnauthorizedException for invalid token', () => {
    expect(() => jwtService.verify('invalid.token.here')).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for expired token', () => {
    // Create a token with a very short expiry
    (configService.getOrThrow as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        if (key === 'JWT_EXPIRES_IN') return '1ms';
        throw new Error(`Missing config key: ${key}`);
      },
    );
    const token = jwtService.sign(mockUser);
    // Wait for token to expire
    return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      expect(() => jwtService.verify(token)).toThrow(UnauthorizedException);
    });
  });
});
