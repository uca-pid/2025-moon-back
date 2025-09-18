import { CreateUserDto } from 'src/infraestructure/dtos/users/create-user.dto';
import { LoginUserDto } from 'src/infraestructure/dtos/users/login-user.dto';
import { User } from 'src/infraestructure/entities/users/user.entity';

export interface IUsersService {
  create(dto: CreateUserDto): Promise<User>;
  login(dto: LoginUserDto): Promise<{ token: string }>;
}

export const IUsersServiceToken = 'IUsersService';
