import { LoggingColor } from '@etimo-achievements/types';
import { getEnvVariable } from '@etimo-achievements/utils';
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
    const startTime = ctx.requestDate.getTime();
    const request = `${req.method} ${req.path}`;

    let color = LoggingColor.Green;

    if (getEnvVariable('LOG_REQUESTS') === 'true') {
      ctx.logger.info(`[${count}] -> ${request} {${rid}} [${req.ip}]`, { color: LoggingColor.Dim });
    }

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
      logResponse(res, `[${count}] <- ${request} ${res.statusCode} ${error.message} {${rid}}`);
    };

    const logClose = () => {
      removeHandlers();
      logResponse(res, `[${count}] X aborted {${rid}}`);
    };

    const logFinish = () => {
      removeHandlers();
      const elapsed = Date.now() - startTime;
      logResponse(res, `[${count}] <- ${request} (${res.statusCode} ${res.statusMessage}) {${rid}} [${elapsed}ms]`);
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
