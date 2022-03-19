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

    const logResponse = (res: Response, message: string) => {
      color = getColor(res.statusCode);
      ctx.logger.info(message, { color });
    };
    const removeHandlers = () => {
      res.off('close', logClose);
      res.off('error', logError);
      res.off('finish', logFinish);
    };
    const logError = (error: any) => {
      removeHandlers();
      logResponse(res, `[${count}] <- ${res.statusCode} ${error.message} {${rid}}`);
    };
    const logClose = () => {
      removeHandlers();
      logResponse(res, `[${count}] X aborted {${rid}}`);
    };
    const logFinish = () => {
      removeHandlers();
      logResponse(res, `[${count}] <- ${res.statusCode} {${rid}}`);
    };

    req.on('error', logError);
    res.on('close', logClose);
    res.on('error', logError);
    res.on('finish', logFinish);

    next();
  };
};

const getColor = (statusCode?: number) => {
  if (!statusCode) {
    return LoggingColor.Red;
  }

  return (statusCode >= 200 && statusCode <= 299) || statusCode === 301 || statusCode === 304
    ? LoggingColor.Green
    : LoggingColor.Red;
};
