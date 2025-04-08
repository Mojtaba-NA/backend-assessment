import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  error(message: any, ...optionalParams: any[]): void {
    // do something with the message
    super.error(message, ...optionalParams);
  }
}
