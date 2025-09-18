import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/infraestructure/dtos/users/create-user.dto';
import { LoginUserDto } from 'src/infraestructure/dtos/users/login-user.dto';
import { PasswordRecoveryDto } from 'src/infraestructure/dtos/users/password-recovery.dto';
import { ChangePasswordDto } from 'src/infraestructure/dtos/users/change-password.dto';
import {
  IUsersServiceToken,
  type IUsersService,
} from 'src/domain/interfaces/users-service.interface';
import {
  IPasswordRecoveryServiceToken,
  type IPasswordRecoveryService,
} from 'src/domain/interfaces/password-recovery-service.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(IUsersServiceToken) private readonly usersService: IUsersService,
    @Inject(IPasswordRecoveryServiceToken)
    private readonly passwordRecoveryService: IPasswordRecoveryService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('/password-recovery')
  passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    return this.passwordRecoveryService.request(passwordRecoveryDto);
  }

  @Post('/change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.passwordRecoveryService.change(changePasswordDto);
  }
}
