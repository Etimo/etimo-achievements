import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    next(error);

    switch (error.name) {
      case 'Bad Request': // express-openapi-validator
        res.statusCode = 400;
        break;

      case 'UnauthorizedError':
        res.statusCode = 401;
        break;

      case 'Not Found':
      case 'NotFoundError':
        res.statusCode = 404;
        break;

      case 'ConflictError':
        res.statusCode = 409;
        break;

      default:
        res.statusCode = 500;
        break;
    }

    return res.send({ error: error.message });
  };
};
