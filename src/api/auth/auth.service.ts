import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entity/User';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { AuthorizedUser } from 'src/database/entity/AuthorizedUser';
import { InjectRepository } from '@nestjs/typeorm';
import { isExists } from 'src/helpers/isExists';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthorizedUser)
    private readonly authorizedUsersRepository: Repository<AuthorizedUser>,
  ) {}

  private async generateTokens(userId: string, userLogin: string) {
    const payload = { userId: userId, login: userLogin };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env['SECRET'],
    });

    const refreshToken = uuidv4();
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const expiresAt = now.getTime();
    now.setHours(now.getHours() + 2);
    const refreshExpiresAt = now.getTime();

    return { accessToken, refreshToken, expiresAt, refreshExpiresAt };
  }

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
      const tokensWithTimers = await this.generateTokens(user.id, user.login);
      const { accessToken, refreshToken } = tokensWithTimers;
      const entity = {
        userId: user.id,
        ...tokensWithTimers,
        user,
      };
      await this.authorizedUsersRepository.save(entity);
      return { accessToken, refreshToken };
    }
  }

  async refresh(refreshDto: RefreshDto) {
    const refreshTokenOld = refreshDto.refreshToken;
    const loggedUser = await this.authorizedUsersRepository.findOneBy({
      refreshToken: refreshTokenOld,
    });
    if (!loggedUser) {
      throw new ForbiddenException('Invalid refresh token');
    }
    if (loggedUser.refreshExpiresAt < Date.now()) {
      throw new ForbiddenException('Refresh token is expired');
    }
    const tokensWithTimers = await this.generateTokens(
      loggedUser.userId,
      loggedUser.user.login,
    );
    const { accessToken, refreshToken } = tokensWithTimers;
    const updatedLoggedUser = {
      ...loggedUser,
      ...tokensWithTimers,
    };
    await this.authorizedUsersRepository.save(updatedLoggedUser);
    return { accessToken, refreshToken };
  }
}
