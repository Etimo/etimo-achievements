import { Logger, UnauthorizedError } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';

const excludedPaths = ['/version', '/swagger', '/swagger.json', '/favicon.ico'];

export const apiKeyMiddleware = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (excludedPaths.some((p) => req.path === p || req.path.startsWith(`${p}/`))) {
      Logger.log(`Path ${req.path} is excluded from authentication`);
      return next();
    }

    const apiKey = process.env.API_KEY;

    if (req.headers['x-api-key'] === apiKey) {
      return next();
    }

    if (req.query['apiKey'] === apiKey) {
      return next();
    }

    throw new UnauthorizedError('Invalid API key');
  };
};
