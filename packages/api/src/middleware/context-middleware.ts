import { isProduction, isStaging, uuid } from '@etimo-achievements/common';
import { WinstonLogger } from '@etimo-achievements/utils';
import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';
import { Context } from '../context';

export const setContextMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);

    const context = new Context(req);

    // Use Winston logger for cloud environments
    if (isStaging() || isProduction()) {
      context.setLogger(new WinstonLogger(context));
    }

    httpContext.set('context', context);
    next();
  };
};

export const contextMiddleware = () => httpContext.middleware;
