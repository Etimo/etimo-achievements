export type LoggerOptions = {
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

export interface ILogger {
  push(key: string, value: string): void;
  pop(key: string): void;
  trace(message: string, options?: LoggerOptions): void;
  debug(message: string, options?: LoggerOptions): void;
  info(message: string, options?: LoggerOptions): void;
  warn(message: string, options?: LoggerOptions): void;
  error(message: string, options?: LoggerOptions): void;
}
