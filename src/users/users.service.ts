import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { HashService } from 'src/hash.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from 'src/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

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

    const token = this.jwtService.sign({
      address: user.address,
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      userRole: user.userRole,
      workshopName: user.workshopName,
    });

    return { token };
  }
}
