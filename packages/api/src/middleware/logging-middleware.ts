import { NextFunction, Request, Response } from 'express';
import { getContext } from '../utils';

const ignoredPaths: string[] = ['/favicon.ico'];

const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';

export const loggingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (ignoredPaths.some((p) => p === req.path)) {
      return next();
    }

    const ctx = getContext();

    ctx.logger.info(
      `${green}[${ctx.timestamp}] [${ctx.requestCount}] -> ${req.method} ${req.path} {${ctx.shortRequestId}} [${req.ip}]${reset}`
    );
    next();
    const color = getColor(res.statusCode);
    ctx.logger.info(
      `${color}[${ctx.timestamp}] [${ctx.requestCount}] <- ${res.statusCode} {${ctx.shortRequestId}}${reset}`
    );
  };
};

const getColor = (statusCode?: number) => {
  if (!statusCode) {
    return red;
  }

  return statusCode >= 200 && statusCode <= 299 ? green : red;
};
