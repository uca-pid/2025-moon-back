import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import {
  IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';
import {
  IServiceRepository,
  IServiceRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { ServiceService } from './service.service';
import { Service } from 'src/infraestructure/entities/service/service.entity';

describe('ServiceService', () => {
  let serviceService: IServiceService;
  const serviceRepositoryMock = mockDeep<IServiceRepository>();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IServiceServiceToken, useClass: ServiceService },
        {
          provide: IServiceRepositoryToken,
          useValue: serviceRepositoryMock,
        },
      ],
    }).compile();

    serviceService = module.get<IServiceService>(IServiceServiceToken);
  });

  describe('getAll', () => {
    it('should return all services', async () => {
      const services: Service[] = [
        { id: 1, name: 'Service 1' } as Service,
        { id: 2, name: 'Service 2' } as Service,
      ];
      serviceRepositoryMock.findAll.mockResolvedValue(services);

      const result = await serviceService.getAll();

      expect(serviceRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(services);
    });
  });

  describe('getById', () => {
    it('should return a service by id', async () => {
      const service: Service = { id: 1, name: 'Service 1' } as Service;
      serviceRepositoryMock.findById.mockResolvedValue(service);

      const result = await serviceService.getByIdWithMechanic(1);

      expect(serviceRepositoryMock.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(service);
    });

    it('should return undefined if service not found', async () => {
      // @ts-expect-error is undefined
      serviceRepositoryMock.findById.mockResolvedValue(undefined);

      const result = await serviceService.getByIdWithMechanic(999);

      expect(serviceRepositoryMock.findById).toHaveBeenCalledWith(999);
      expect(result).toBeUndefined();
    });
  });
});
