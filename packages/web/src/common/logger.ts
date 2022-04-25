export class Logger {
  private static instance?: Logger;

  public static log(message: string) {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    Logger.instance.info(message);
  }

  public static error(error: Error) {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    Logger.instance.error(error.message);
  }

  public trace(message: string) {
    console.debug(message);
  }

  public debug(message: string) {
    console.debug(message);
  }

  public info(message: string) {
    console.info(message);
  }

  public warn(message: string) {
    console.warn(message);
  }

  public error(message: string) {
    console.error(message);
  }
}
