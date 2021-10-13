import { NextFunction, Request, Response } from 'express';

export const apiKeyMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      res.status(401).send('Unauthorized');
    }
    next();
  };
};
