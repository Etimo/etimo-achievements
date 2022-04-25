import { ILogger, IRequestContext, LoggerOptions } from '@etimo-achievements/types';
import winston from 'winston';

type ILoggingContext = Pick<IRequestContext, 'requestId' | 'userId' | 'scopes'>;

export class WinstonLogger implements ILogger {
  private options: winston.LoggerOptions;
  private meta: any = {};
  private instance: winston.Logger;

  constructor(private context: IRequestContext) {
    this.options = {
      level: 'debug',
      format: winston.format.combine(winston.format.json()),
      transports: [new winston.transports.Console()],
    };
    this.instance = winston.createLogger(this.options);
  }

  public push(key: string, value: any) {
    this.meta[key] = value;
  }

  public pop(key: string) {
    delete this.meta[key];
  }

  public getLoggingContext(): ILoggingContext {
    return {
      requestId: this.context.requestId,
      userId: this.context.jwt?.sub ?? '<anonymous>',
      scopes: this.context.scopes,
      ...this.meta,
    };
  }

  public trace(message: string, options?: LoggerOptions) {
    this.output(message, this.instance.debug, options);
  }

  public debug(message: string, options?: LoggerOptions) {
    this.output(message, this.instance.debug, options);
  }

  public info(message: string, options?: LoggerOptions) {
    this.output(message, this.instance.info, options);
  }

  public warn(message: string, options?: LoggerOptions) {
    this.output(message, this.instance.warn, options);
  }

  public error(message: string, options?: LoggerOptions) {
    this.output(message, this.instance.error, options);
  }

  private output(message: string, logFn: (message: string, ...args: any[]) => void, options?: LoggerOptions) {
    logFn(message, { ...options?.extras, ...this.getLoggingContext() });
  }
}
