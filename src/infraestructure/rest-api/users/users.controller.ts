import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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
import { UpdateUserDto } from 'src/infraestructure/dtos/users/update-user.dto';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import type { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { UpdateUserPasswordDto } from 'src/infraestructure/dtos/users/update-user-password.dto';
import { ReviewDto } from 'src/infraestructure/dtos/users/review.dto';
import {
  IUserReviewServiceToken,
  type IUserReviewService,
} from 'src/domain/interfaces/user-review.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(IUsersServiceToken) private readonly usersService: IUsersService,
    @Inject(IPasswordRecoveryServiceToken)
    private readonly passwordRecoveryService: IPasswordRecoveryService,
    @Inject(IUserReviewServiceToken)
    private readonly userReviewService: IUserReviewService,
  ) {}

  @Get('/workshops')
  getAllWorkshops() {
    return this.usersService.getAllWorkshops();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put()
  update(@Body() dto: UpdateUserDto, @AuthenticatedUser() user: JwtPayload) {
    return this.usersService.update(user, dto);
  }

  @Put('/password')
  updatePassword(
    @Body() dto: UpdateUserPasswordDto,
    @AuthenticatedUser() user: JwtPayload,
  ) {
    return this.usersService.updatePassword(user, dto);
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

  @Post('/review')
  review(@Body() reviewDto: ReviewDto, @AuthenticatedUser() user: JwtPayload) {
    return this.userReviewService.setReview(
      user.id,
      reviewDto.mechanicId,
      reviewDto.review,
    );
  }

  @Get('/review')
  async getReviews(@AuthenticatedUser() user: JwtPayload) {
    const reviews = await this.userReviewService.getUserReviews(user.id);
    return { reviews };
  }

  @Get('/review/:mechanicId')
  async getReview(
    @Param('mechanicId') mechanicId: string,
    @AuthenticatedUser() user: JwtPayload,
  ) {
    const review = await this.userReviewService.getReview(
      user.id,
      Number(mechanicId),
    );
    return { review };
  }

  @Get('/:id')
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findById(id);
  }
}
