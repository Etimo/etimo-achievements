import { isProduction, isStaging } from '@etimo-achievements/common';
import { ILogger, IRequestContext, LoggerOptions, LoggingColor } from '@etimo-achievements/types';
import { ContextLogger } from './context-logger';

export class DevLogger extends ContextLogger implements ILogger {
  constructor(private context: IRequestContext) {
    super();
  }

  public trace(message: string, options?: LoggerOptions) {
    this.output(`[T] ${message}`, LoggingColor.Dim, console.debug, options);
  }

  public debug(message: string, options?: LoggerOptions) {
    this.output(`[D] ${message}`, LoggingColor.Normal, console.debug, options);
  }

  public info(message: string, options?: LoggerOptions) {
    this.output(`[I] ${message}`, LoggingColor.Bright, console.info, options);
  }

  public warn(message: string, options?: LoggerOptions) {
    this.output(`[WARN] ${message}`, LoggingColor.Yellow, console.warn, options);
  }

  public error(message: string, options?: LoggerOptions) {
    this.output(`[ERROR] ${message}`, LoggingColor.Red, console.error, options);
  }

  private output(
    message: string,
    defaultColor: LoggingColor,
    logFn: (message: string, ...args: any[]) => void,
    options?: LoggerOptions
  ) {
    const output = this.getMessage(message, { color: defaultColor, ...options });
    const meta = JSON.stringify({ ...options?.extras, ...this.context.loggingContext, ...this.meta });
    if (meta !== '{}') {
      logFn(output, meta);
    } else {
      logFn(output);
    }
  }

  private getMessage(message: string, options?: LoggerOptions) {
    const reset = colorCode(LoggingColor.Reset);
    const color = options?.color ? colorCode(options.color) : reset;
    return `${color}${timestamp(options?.timestamp)}${message}${reset}`;
  }
}

function colorCode(color: LoggingColor): string {
  switch (color) {
    case LoggingColor.Bright:
      return '';
    case LoggingColor.Dim:
      return '\x1b[2m';
    case LoggingColor.Green:
      return '\x1b[32m';
    case LoggingColor.Yellow:
      return '\x1b[33m';
    case LoggingColor.Red:
      return '\x1b[31m';
    case LoggingColor.Reset:
      return '\x1b[0m';
    case LoggingColor.Normal:
    default:
      return '\x1b[90m';
  }
}

function timestamp(enabled?: boolean) {
  if ((isProduction() || isStaging()) && !enabled) {
    return '';
  }

  return `[${new Date().toTimeString().split(' ')[0]}] `;
}
