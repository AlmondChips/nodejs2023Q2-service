import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, query, body } = request;
    const logMessage = {
      method,
      originalUrl,
      query,
      body,
    };
    this.loggingService.logRequest(logMessage);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const logMessage = {
          method,
          originalUrl,
          statusCode,
        };
        this.loggingService.logResponse(logMessage);
      }),
    );
  }
}
