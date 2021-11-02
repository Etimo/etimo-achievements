import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';

const excludedPaths = ['/version', '/swagger', '/apidoc.json'];

export const apiKeyMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (excludedPaths.some((p) => req.path === p || req.path.startsWith(`${p}/`))) {
      console.log(`Path ${req.path} is excluded from authentication`);
      return next();
    }
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new UnauthorizedError('Invalid API key');
    }
    next();
  };
};
