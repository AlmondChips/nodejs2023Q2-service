import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggingService } from './logging.service';
import { LoggerService } from '@nestjs/common';

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   private readonly logger = new LoggingService();
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();

//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//     const req = host.switchToHttp().getRequest<Request>();
//     const res = host.switchToHttp().getRequest<Response>();

//     this.logger.error(
//       `Status code: ${httpStatus} ${req.url}`,
//       AllExceptionsFilter.name,
//     );
//     res.
//     super.catch(exception, host);
//   }
// }

export class LoggingExceptionFilter extends BaseExceptionFilter {
  private logger = new LoggingService(LoggingExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);
    super.catch(exception, host);
  }
}
