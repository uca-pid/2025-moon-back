import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {
  IUsersService,
  IUsersServiceToken,
} from 'src/domain/interfaces/users-service.interface';
import {
  IPasswordRecoveryService,
  IPasswordRecoveryServiceToken,
} from 'src/domain/interfaces/password-recovery-service.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<Record<keyof IUsersService, jest.Mock>>;
  let passwordRecoveryService: Partial<
    Record<keyof IPasswordRecoveryService, jest.Mock>
  >;

  beforeEach(async () => {
    usersService = {
      getAllWorkshops: jest.fn().mockReturnValue(['workshop1', 'workshop2']),
      create: jest.fn(),
      update: jest.fn(),
    };
    passwordRecoveryService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: IUsersServiceToken, useValue: usersService },
        {
          provide: IPasswordRecoveryServiceToken,
          useValue: passwordRecoveryService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all workshops', () => {
    expect(controller.getAllWorkshops()).toEqual(['workshop1', 'workshop2']);
    expect(usersService.getAllWorkshops).toHaveBeenCalled();
  });
});
