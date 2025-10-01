import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import {
  IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { Service } from 'src/infraestructure/entities/service/service.entity';

describe('ServiceController', () => {
  let controller: ServiceController;
  let serviceServiceMock: MockProxy<IServiceService>;

  beforeEach(async () => {
    serviceServiceMock = mockDeep<IServiceService>();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        { provide: IServiceServiceToken, useValue: serviceServiceMock },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  describe('getAll', () => {
    it('should return an array of services', async () => {
      const services: Service[] = [
        { id: 1, name: 'Service 1' } as Service,
        { id: 2, name: 'Service 2' } as Service,
      ];
      serviceServiceMock.getAll.mockResolvedValue(services);

      const result = await controller.getAll();

      expect(result).toEqual(services);
      expect(serviceServiceMock.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return a service by id', async () => {
      const service: Service = { id: 1, name: 'Service 1' } as Service;
      serviceServiceMock.getByIdWithMechanic.mockResolvedValue(service);

      const result = await controller.getById(1);

      expect(result).toEqual(service);
      expect(serviceServiceMock.getByIdWithMechanic).toHaveBeenCalledWith(1);
    });

    it('should return undefined if service not found', async () => {
      serviceServiceMock.getByIdWithMechanic.mockResolvedValue(
        undefined as any,
      );

      const result = await controller.getById(999);

      expect(result).toBeUndefined();
      expect(serviceServiceMock.getByIdWithMechanic).toHaveBeenCalledWith(999);
    });
  });
});
