import { ConflictError, NotFoundError, UnauthorizedError } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    return handleError(error, res);
  };
};

export function handleError(error: any, res: Response) {
  switch (error.constructor) {
    case UnauthorizedError:
      return res.status(401);

    case NotFoundError:
      return res.status(404);

    case ConflictError:
      return res.status(409);

    default:
      return res.status(500);
  }
}
