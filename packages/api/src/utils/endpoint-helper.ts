import { NextFunction, Request, Response } from 'express';

export function endpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    endpointFn(req, res).catch((error) => next(error));
  };
}

export function createdResponse(path: string, resource: any, res: Response) {
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  res.status(201).header('Location', `/${path}/${resource.id}`).send({ id: resource.id });
}
