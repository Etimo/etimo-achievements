type LoggerOptions = {
  extras?: any[];
  color?: LoggingColor;
  timestamp?: boolean;
};

export enum LoggingColor {
  Reset,
  Bright,
  Normal,
  Dim,
  Green,
  Yellow,
  Red,
}

export class Logger {
  private static instance?: Logger;

  public static log(message: string, options?: LoggerOptions) {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    Logger.instance.info(message, options);
  }

  public trace(message: string, options?: LoggerOptions) {
    this.output(message, LoggingColor.Dim, console.debug, options);
  }

  public debug(message: string, options?: LoggerOptions) {
    this.output(message, LoggingColor.Normal, console.debug, options);
  }

  public info(message: string, options?: LoggerOptions) {
    this.output(message, LoggingColor.Bright, console.info, options);
  }

  public warn(message: string, options?: LoggerOptions) {
    this.output(message, LoggingColor.Yellow, console.warn, options);
  }

  public error(message: string, options?: LoggerOptions) {
    this.output(message, LoggingColor.Red, console.error, options);
  }

  private output(
    message: string,
    defaultColor: LoggingColor,
    logFn: (message: string, ...args: any[]) => void,
    options?: LoggerOptions
  ) {
    const output = this.getMessage(message, { color: defaultColor, ...options });
    if (options?.extras) {
      logFn(output, options.extras);
    }
    logFn(output);
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
  if (enabled === undefined || enabled) {
    return `[${new Date().toTimeString().split(' ')[0]}] `;
  }
  return '';
}
