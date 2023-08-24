import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly jwsService: JwtService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    let authHeader;
    let schema, token;
    try {
      authHeader = req.headers.authorization;
      [schema, token] = authHeader && authHeader.split(' ');
    } catch (error) {
      throw new UnauthorizedException('No token provided');
    }

    if (schema !== 'Bearer') {
      throw new UnauthorizedException('Invalid Bearer schema');
    }
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      this.jwsService.verify(token, {
        secret: process.env['SECRET'],
      });
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    return next.handle();
  }
}
