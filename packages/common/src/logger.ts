export class Logger {
  private static instance?: Logger;

  public static log(message: string, ...optionalParams: any[]) {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    Logger.instance.info(message, ...optionalParams);
  }

  public trace(message: string, ...optionalParams: any[]) {
    console.trace(timestamp() + message, ...optionalParams);
  }

  public info(message: string, ...optionalParams: any[]) {
    console.info(timestamp() + message, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: any[]) {
    console.warn(timestamp() + message, ...optionalParams);
  }

  public error(message: string, ...optionalParams: any[]) {
    console.error(timestamp() + message, ...optionalParams);
  }
}

function timestamp() {
  return `[${new Date().toTimeString().split(' ')[0]}] `;
}
