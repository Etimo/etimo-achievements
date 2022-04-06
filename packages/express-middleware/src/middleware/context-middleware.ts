import { Context, uuid } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';

export const setContextMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);

    const requestId = req.get('X-Request-Id') ?? uuid();

    const context = new Context(requestId);
    console.log(context);
    httpContext.set('context', context);
    next();
  };
};

export const contextMiddleware = () => httpContext.middleware;
