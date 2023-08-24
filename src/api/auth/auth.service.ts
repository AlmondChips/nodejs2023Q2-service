import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entity/User';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { AuthorizedUser } from 'src/database/entity/AuthorizedUser';
import { InjectRepository } from '@nestjs/typeorm';
import { isExists } from 'src/helpers/isExists';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthorizedUser)
    private readonly authorizedUsersRepository: Repository<AuthorizedUser>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async validateUser(loginDto: CreateUserDto) {
    return await this.userService.findByLoginAndPassword(loginDto);
  }

  async login(user: User) {
    const authSession = await this.authorizedUsersRepository.findOneBy({
      userId: user.id,
    });
    try {
      isExists(authSession);
      return {
        accessToken: authSession.accessToken,
        refreshToken: authSession.refreshToken,
      };
    } catch (e) {
      const payload = { userId: user.id, login: user.login };
      const accessToken = await this.jwtService.sign(payload, {
        secret: process.env['SECRET'],
      });

      const refreshToken = uuidv4();
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const entity = {
        userId: user.id,
        refreshToken,
        accessToken,
        expiresAt: now.getTime(),
      };
      await this.authorizedUsersRepository.save(entity);
      return {
        accessToken,
        refreshToken,
      };
    }
  }
}
