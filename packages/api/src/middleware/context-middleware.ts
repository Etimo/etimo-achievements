import { Context } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';
import httpContext from 'express-http-context';

export const contextMiddleware = () => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const context = new Context();
    httpContext.set('context', context);
    next();
  };
};
