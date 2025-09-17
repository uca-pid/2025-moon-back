import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { PasswordRecoveryService } from './password-recovery.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly recoveryService: PasswordRecoveryService,
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
    return this.recoveryService.requestPasswordRecovery(passwordRecoveryDto);
  }

  @Post('/change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.recoveryService.changePassword(changePasswordDto);
  }
}
