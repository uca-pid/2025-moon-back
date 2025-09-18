import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { CreateUserDto } from 'src/infraestructure/dtos/users/create-user.dto';
import { LoginUserDto } from 'src/infraestructure/dtos/users/login-user.dto';
import { UpdateUserPasswordDto } from 'src/infraestructure/dtos/users/update-user-password.dto';
import { UpdateUserDto } from 'src/infraestructure/dtos/users/update-user.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';

export interface IUsersService {
  create(dto: CreateUserDto): Promise<User>;
  update(user: JwtPayload, dto: UpdateUserDto): Promise<{ token: string }>;
  updatePassword(user: JwtPayload, dto: UpdateUserPasswordDto): Promise<void>;
  login(dto: LoginUserDto): Promise<{ token: string }>;
}

export const IUsersServiceToken = 'IUsersService';
