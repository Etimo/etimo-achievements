import { UnauthorizedError } from '@etimo-achievements/common';
import { getContext } from '@etimo-achievements/express-middleware';
import { CookieName, JwtService } from '@etimo-achievements/security';
import { NextFunction, Request, Response } from 'express';

export function apiKeyEndpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = process.env.API_KEY;

    if (req.query['apiKey'] !== apiKey) {
      throw new UnauthorizedError('Invalid API key');
    }

    endpointFn(req, res).catch((error) => next(error));
  };
}

export function protectedEndpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[CookieName.Jwt];
    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }
    try {
      const ctx = getContext();
      ctx.jwt = JwtService.verify(token);
    } catch {
      throw new UnauthorizedError('Access token could not be verified');
    }
    endpointFn(req, res).catch((error) => next(error));
  };
}

export function endpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    endpointFn(req, res).catch((error) => next(error));
  };
}

export function createdResponse(path: string, resource: any, res: Response) {
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  res.status(201).header('Location', `/${path}/${resource.id}`).send({ id: resource.id });
}
