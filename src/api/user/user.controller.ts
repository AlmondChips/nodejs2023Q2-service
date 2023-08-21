import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { UUIDValidationPipe } from 'src/api/pipes/uuid.validation.pipe';
import { LogginInterceptor } from '../logging/logging.interceptor';

@Controller('user')
@UseInterceptors(LogginInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async updatePassword(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    return await this.userService.remove(id);
  }
}
