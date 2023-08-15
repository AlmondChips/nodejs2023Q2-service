import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthorizedUser } from 'src/database/entity/AuthorizedUser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/database/entity/User';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env['SECRET'],
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AuthorizedUser]),
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
