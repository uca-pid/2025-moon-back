import { Test, TestingModule } from '@nestjs/testing';
import {
  IHashService,
  IHashServiceToken,
} from 'src/domain/interfaces/hash-service.interface';
import { HashService } from './hash.service';

describe('HashService', () => {
  let hashService: IHashService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: IHashServiceToken, useClass: HashService }],
    }).compile();

    hashService = module.get<IHashService>(IHashServiceToken);
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  it('should hash a password', async () => {
    const password = 'mySecretPassword';
    const hashed = await hashService.hash(password);
    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(0);
  });

  it('should verify a correct password', async () => {
    const password = 'testPassword';
    const hashed = await hashService.hash(password);
    const isValid = await hashService.verify(password, hashed);
    expect(isValid).toBe(true);
  });

  it('should not verify an incorrect password', async () => {
    const password = 'testPassword';
    const wrongPassword = 'wrongPassword';
    const hashed = await hashService.hash(password);
    const isValid = await hashService.verify(wrongPassword, hashed);
    expect(isValid).toBe(false);
  });
});
