import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ForbiddenException } from '@nestjs/common';
import { RefreshDto } from './dto/refresh.dto';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: CreateUserDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    return await this.authService.login(user);
  }

  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
