import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../../infraestructure/dtos/users/create-user.dto';
import { LoginUserDto } from '../../infraestructure/dtos/users/login-user.dto';
import { IUsersService } from '../interfaces/users-service.interface';

import { IHashServiceToken } from '../interfaces/hash-service.interface';
import type { IHashService } from '../interfaces/hash-service.interface';
import type { IJwtService } from '../interfaces/jwt-service.interface';
import { IJwtServiceToken } from '../interfaces/jwt-service.interface';
import { IUsersRepositoryToken } from 'src/infraestructure/repositories/interfaces/users-repository.interface';
import type { IUsersRepository } from 'src/infraestructure/repositories/interfaces/users-repository.interface';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { UpdateUserDto } from 'src/infraestructure/dtos/users/update-user.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(IUsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,
    @Inject(IHashServiceToken) private readonly hashService: IHashService,
    @Inject(IJwtServiceToken) private readonly jwtService: IJwtService,
  ) {}

  async update(
    userPayload: JwtPayload,
    dto: UpdateUserDto,
  ): Promise<{ token: string }> {
    const user = await this.usersRepository.findByIdOrThrow(userPayload.id);
    user.fullName = dto.fullName;
    await this.usersRepository.save(user);
    const token = this.jwtService.sign(user);
    return { token };
  }

  async create(dto: CreateUserDto) {
    const conflictingUser = await this.usersRepository.findByEmail(dto.email);
    if (conflictingUser) {
      throw new HttpException('email already existing', HttpStatus.CONFLICT);
    }

    return this.usersRepository.save({
      address: dto.address,
      email: dto.email,
      fullName: dto.fullName,
      hashedPassword: await this.hashService.hash(dto.password),
      workshopName: dto.workshopName,
      userRole: dto.userRole,
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (
      !user ||
      !(await this.hashService.verify(dto.password, user?.hashedPassword))
    ) {
      throw new UnauthorizedException('invalid login');
    }

    const token = this.jwtService.sign(user);

    return { token };
  }
}
