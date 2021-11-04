import { ConflictError } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    return handleError(error, res);
  };
};

export function handleError(error: any, res: Response) {
  switch (error.constructor) {
    case ConflictError:
      return res.status(409).send(error.message);

    default:
      return res.status(500).send(error.message);
  }
}
