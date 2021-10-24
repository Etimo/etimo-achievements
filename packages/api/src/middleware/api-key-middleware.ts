import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';

export const apiKeyMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new UnauthorizedError('Invalid API key');
    }
    next();
  };
};
