import { NextFunction, Request, Response } from 'express';
import { getContext } from '../utils';

let count: number = 0;
const ignoredPaths: string[] = ['/favicon.ico'];

const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';

export const loggingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (ignoredPaths.some((p) => p === req.path)) {
      return next();
    }

    const { logger, shortRequestId } = getContext();

    const timestamp = new Date().toTimeString().split(' ')[0];
    const i = `${++count}`.padStart(4, '0');

    logger.info(`${green}[${timestamp}] [${i}] -> ${req.method} ${req.path} {${shortRequestId}} [${req.ip}]${reset}`);
    next();
    const color = getColor(res.statusCode);
    logger.info(`${color}[${timestamp}] [${i}] <- ${res.statusCode} {${shortRequestId}}${reset}`);
  };
};

const getColor = (statusCode?: number) => {
  if (!statusCode) {
    return red;
  }

  return statusCode >= 200 && statusCode <= 299 ? green : red;
};
