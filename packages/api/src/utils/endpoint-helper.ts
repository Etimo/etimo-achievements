import { fromBase64, Logger, UnauthorizedError } from '@etimo-achievements/common';
import { getContext } from '@etimo-achievements/express-middleware';
import { CookieName, decrypt, JwtService } from '@etimo-achievements/security';
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

export function protectedEndpoint(endpointFn: (req: Request, res: Response) => Promise<any>, scopes?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[CookieName.Jwt];
    const refreshToken = req.cookies[CookieName.RefreshToken];
    const ctx = getContext();

    try {
      const decryptedToken = decrypt(token);
      ctx.jwt = JwtService.verify(decryptedToken);
      ctx.scopes = ctx.jwt?.scope?.split(' ') ?? [];
    } catch {
      throw new UnauthorizedError('The token has expired');
    }

    try {
      const refreshTokenParts = fromBase64(decrypt(refreshToken)).split('.');
      ctx.refreshTokenId = refreshTokenParts[0];
      ctx.refreshTokenKey = refreshTokenParts[1];
    } catch {
      Logger.log('User does not have a refresh token');
    }

    if (scopes && !ctx.scopes?.some((scope) => scopes.includes(scope))) {
      Logger.log('User does not have required scopes');
      throw new UnauthorizedError('Insufficient scope');
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
