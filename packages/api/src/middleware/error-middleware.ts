import { Logger } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    next(error);

    switch (error.name) {
      case 'Bad Request': // express-openapi-validator
      case 'BadRequestError':
        res.statusCode = 400;
        break;

      case 'Unauthorized': // express-openapi-validator
      case 'UnauthorizedError':
        res.statusCode = 401;
        res.header('WWW-Authenticate', 'Bearer error="invalid_token", error_description="' + error.message + '"');
        return res.send({ error: 'Unauthorized' });

      case 'Not Found':
      case 'NotFoundError':
        res.statusCode = 404;
        break;

      case 'ConflictError':
        res.statusCode = 409;
        break;

      default:
        res.statusCode = 500;
        Logger.log(`Unmapped error '${error.name}' occurred: ${error.message}`);
        break;
    }

    return res.send({ error: error.message });
  };
};
