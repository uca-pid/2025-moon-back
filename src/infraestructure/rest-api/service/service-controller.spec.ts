import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import {
  IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import {
  IUsersService,
  IUsersServiceToken,
} from 'src/domain/interfaces/users-service.interface';
import {
  ISparePartService,
  ISparePartServiceToken,
} from 'src/domain/interfaces/spare-part-service.interface';

describe('ServiceController', () => {
  let controller: ServiceController;
  let serviceServiceMock: MockProxy<IServiceService>;
  let usersServiceMock: MockProxy<IUsersService>;
  let sparePartServiceMock: MockProxy<ISparePartService>;

  beforeEach(async () => {
    serviceServiceMock = mockDeep<IServiceService>();
    usersServiceMock = mockDeep<IUsersService>();
    sparePartServiceMock = mockDeep<ISparePartService>();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        { provide: IServiceServiceToken, useValue: serviceServiceMock },
        { provide: IUsersServiceToken, useValue: usersServiceMock },
        { provide: ISparePartServiceToken, useValue: sparePartServiceMock },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  describe('getPaginated', () => {
    it('should return paginated services', async () => {
      const services: Service[] = [
        { id: 1, name: 'Service 1' } as Service,
        { id: 2, name: 'Service 2' } as Service,
      ];
      const paginatedResult = {
        data: services,
        total: 2,
      };
      serviceServiceMock.getPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.getPaginated({} as any, {} as any);

      expect(result).toEqual(paginatedResult);
      expect(serviceServiceMock.getPaginated).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a service by id', async () => {
      const service: Service = { id: 1, name: 'Service 1' } as Service;
      serviceServiceMock.getById.mockResolvedValue(service);

      const result = await controller.getById(1);

      expect(result).toEqual(service);
      expect(serviceServiceMock.getById).toHaveBeenCalledWith(1);
    });

    it('should return undefined if service not found', async () => {
      serviceServiceMock.getById.mockResolvedValue(undefined);

      const result = await controller.getById(999);

      expect(result).toBeUndefined();
      expect(serviceServiceMock.getById).toHaveBeenCalledWith(999);
    });
  });
});
