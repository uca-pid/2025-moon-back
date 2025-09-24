import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import {
  IAppointmentService,
  IAppointmentServiceToken,
} from 'src/domain/interfaces/appointment-service.interface';
import { AppointmentService } from './appointment.service';
import {
  IAppointmentRepository,
  IAppointmentRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { UserRole } from 'src/infraestructure/entities/user/user-role.enum';

describe('AppointmentService', () => {
  let appointmentService: IAppointmentService;
  const appointmentRepositoryMock = mockDeep<IAppointmentRepository>();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: IAppointmentServiceToken, useClass: AppointmentService },
        {
          provide: IAppointmentRepositoryToken,
          useValue: appointmentRepositoryMock,
        },
      ],
    }).compile();

    appointmentService = module.get<IAppointmentService>(
      IAppointmentServiceToken,
    );
  });

  describe('create', () => {
    it('should call appointmentRepository.createAppointment with correct params and return the result', async () => {
      const user: JwtPayload = {
        id: 1,
        email: 'test@test.com',
        userRole: UserRole.USER,
      } as any;
      const service: Service = { id: 2 } as Service;
      const workshop: User = { id: 3 } as User;
      const date = '2024-06-01';
      const time = '10:00';
      const appointment: Appointment = { id: 123 } as Appointment;

      appointmentRepositoryMock.createAppointment.mockResolvedValue(
        appointment,
      );

      const result = await appointmentService.create(
        user,
        date,
        time,
        service,
        workshop,
      );

      expect(appointmentRepositoryMock.createAppointment).toHaveBeenCalledWith({
        userId: user.id,
        date,
        time,
        serviceId: service.id,
        workshopId: workshop.id,
      });
      expect(result).toBe(appointment);
    });
  });

  describe('getNextAppointmentsOfUser', () => {
    it('should call appointmentRepository.getNextAppointmentsOfUser and return the result', async () => {
      const userId = 1;
      const appointments: Appointment[] = [{ id: 1 } as Appointment];
      appointmentRepositoryMock.getNextAppointmentsOfUser.mockResolvedValue(
        appointments,
      );

      const result = await appointmentService.getNextAppointmentsOfUser(userId);

      expect(
        appointmentRepositoryMock.getNextAppointmentsOfUser,
      ).toHaveBeenCalledWith(userId);
      expect(result).toBe(appointments);
    });
  });

  describe('getNextAppointmentsOfWorkshop', () => {
    it('should call appointmentRepository.getNextAppointmentsOfWorkshop and return the result', async () => {
      const workshopId = 2;
      const appointments: Appointment[] = [{ id: 2 } as Appointment];
      appointmentRepositoryMock.getNextAppointmentsOfWorkshop.mockResolvedValue(
        appointments,
      );

      const result =
        await appointmentService.getNextAppointmentsOfWorkshop(workshopId);

      expect(
        appointmentRepositoryMock.getNextAppointmentsOfWorkshop,
      ).toHaveBeenCalledWith(workshopId);
      expect(result).toBe(appointments);
    });
  });
});
