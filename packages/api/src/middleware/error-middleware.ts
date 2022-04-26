import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    next(error);

    switch (error.name) {
      case 'Bad Request': // express-openapi-validator
      case 'BadRequestError':
        res.statusCode = 400;
        return res.send({ error: error.message });

      case 'Unauthorized': // express-openapi-validator
      case 'UnauthorizedError':
        res.statusCode = 401;
        res.header('WWW-Authenticate', 'Bearer error="invalid_token", error_description="' + error.message + '"');
        return res.send({ error: 'Unauthorized' });

      case 'ForbiddenError':
        res.statusCode = 403;
        res.header('WWW-Authenticate', 'Bearer error="insufficient_scope", error_description="' + error.message + '"');
        return res.send({ error: 'Forbidden' });

      case 'Not Found':
      case 'NotFoundError':
        res.statusCode = 404;
        return res.send({ error: 'Not Found' });

      case 'ConflictError':
        res.statusCode = 409;
        return res.send({ error: 'Conflict' });

      default:
        res.statusCode = 500;
        console.error(`Unmapped error '${error.name}' occurred: ${error.message}`);
        return res.send({ error: 'Internal Server Error' });
    }
  };
};
