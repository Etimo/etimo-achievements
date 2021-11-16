import { LoggingColor } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';
import { getContext } from '../utils';

const ignoredPaths: string[] = ['/favicon.ico'];

export const loggingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (ignoredPaths.some((p) => p === req.path)) {
      return next();
    }

    const ctx = getContext();
    const count = ctx.requestCount;
    const rid = ctx.shortRequestId;

    let color = LoggingColor.Green;
    ctx.logger.info(`[${count}] -> ${req.method} ${req.path} {${rid}} [${req.ip}]`, { color });

    next();

    color = getColor(res.statusCode);
    ctx.logger.info(`[${count}] <- ${res.statusCode} {${rid}}`, { color });
  };
};

const getColor = (statusCode?: number) => {
  if (!statusCode) {
    return LoggingColor.Red;
  }

  return statusCode >= 200 && statusCode <= 299 ? LoggingColor.Green : LoggingColor.Red;
};
