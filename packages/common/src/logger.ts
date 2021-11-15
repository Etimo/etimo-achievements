export class Logger {
  private static instance?: Logger;

  public static log(message: string, ...optionalParams: any[]) {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    Logger.instance.info(message, ...optionalParams);
  }

  public trace(message: string, ...optionalParams: any[]) {
    console.trace(message, ...optionalParams);
  }

  public info(message: string, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }

  public error(message: string, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}
