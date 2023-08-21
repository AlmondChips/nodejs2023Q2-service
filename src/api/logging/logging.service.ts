import { Injectable, LoggerService } from '@nestjs/common';
import { logRequest, logResponse } from 'src/interfaces/logger.types';
const colorReset = '\x1b[0m';
const colorBrightCyan = '\x1b[96m';
const colorBrightMagenta = '\x1b[95m';
const colorBrightGreen = '\x1b[92m';
const colorBrightYellow = '\x1b[93m';
const timeFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};

@Injectable()
export class LoggingService implements LoggerService {
  log(message: any, context?: string) {
    console.log(`[LOG] [${context}] ${message}`);
  }

  error(message: any): any {
    console.log(`[ERROR] ${message}`);
  }

  warn(message: any): any {
    console.log(`[WARN] ${message}`);
  }

  logRequest({ method, originalUrl, query, body }: logRequest) {
    const timestamp = new Date().toLocaleString('en-US', timeFormat);
    const divider = '-'.repeat(60); // Divider for better separation

    console.log(
      `${divider}\n` +
        `${colorBrightCyan}[${timestamp}] Request: ${method} ${originalUrl}${colorReset}\n` +
        `${divider}\n` +
        `${colorBrightMagenta}Query:\n${JSON.stringify(
          query,
          undefined,
          2,
        )}${colorReset}\n` +
        `${divider}\n` +
        `${colorBrightGreen}Body:\n${JSON.stringify(
          body,
          undefined,
          2,
        )}${colorReset}\n` +
        `${divider}`,
    );
  }

  logResponse({ method, originalUrl, statusCode }: logResponse) {
    const timestamp = new Date().toLocaleString('en-US', timeFormat);
    const divider = '-'.repeat(60); // Divider for better separation

    console.log(
      `${divider}\n` +
        `${colorBrightCyan}[${timestamp}] Response: ${method} ${originalUrl}${colorReset}\n` +
        `${colorBrightYellow}Status Code: ${statusCode}${colorReset}\n` +
        `${divider}`,
    );
  }
}
