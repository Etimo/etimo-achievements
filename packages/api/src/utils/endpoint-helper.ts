import { NextFunction, Request, Response } from 'express';

/**
 * Creates an endpoint function that catches errors.
 */
export function endpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    endpointFn(req, res).catch((error) => next(error));
  };
}
