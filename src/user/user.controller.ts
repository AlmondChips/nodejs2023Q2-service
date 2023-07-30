import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-users-password.dto';
import { UUIDValidationPipe } from 'src/pipes/uuid.validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.userService.remove(id);
  }
}
