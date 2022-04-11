import { Logger, UnauthorizedError } from '@etimo-achievements/common';
import { getContext } from '@etimo-achievements/express-middleware';
import { CookieName, JwtService, RefreshTokenService } from '@etimo-achievements/security';
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
    const ctx = getContext();

    setJwt(req);
    setRefreshToken(req);

    if (scopes && !ctx.scopes?.some((scope) => scopeMatches(scope, scopes))) {
      Logger.log('User does not have required scopes');
      throw new UnauthorizedError('Insufficient scope');
    }

    endpointFn(req, res).catch((error) => next(error));
  };
}

function scopeMatches(userScope: string, requiredScopes: string[]) {
  for (const requiredScope of requiredScopes) {
    const parts = requiredScope.split(':');
    const requiredGroups = parts[0].split('');
    const requiredTarget = parts[1];
    const userParts = userScope.split(':');
    const userGroups = userParts[0].split('');
    const userTarget = userParts[1];

    const isAdmin = userGroups.includes('a');
    const isPermissionMatch = requiredGroups.every((group) => userGroups.includes(group));
    const hasPermission = (isAdmin || isPermissionMatch) && userTarget === requiredTarget;

    if (hasPermission) return true;
  }
}

function setJwt(req: Request) {
  const ctx = getContext();
  const token = req.signedCookies[CookieName.Jwt];

  try {
    ctx.jwt = JwtService.unlock(token);
    ctx.scopes = ctx.jwt?.scope?.split(' ') ?? [];
  } catch {
    throw new UnauthorizedError('The token has expired');
  }
}

function setRefreshToken(req: Request) {
  const ctx = getContext();
  const refreshToken = req.signedCookies[CookieName.RefreshToken];

  if (refreshToken) {
    try {
      const rt = RefreshTokenService.unlock(refreshToken);
      ctx.refreshTokenId = rt.id;
      ctx.refreshTokenKey = rt.key;
    } catch {
      Logger.log('Invalid refresh token');
    }
  }
}

export function endpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    setRefreshToken(req);

    endpointFn(req, res).catch((error) => next(error));
  };
}

export function createdResponse(path: string, resource: { id: string }, res: Response) {
  path = path.replace(/^\/?([a-z\-]*)\/?$/gi, '$1');
  res.status(201).location(`/${path}/${resource.id}`).send({ id: resource.id });
}

export function okResponse(res: Response, data?: any) {
  res.status(200).send(data);
}

export function noContentResponse(res: Response) {
  res.status(204).send();
}

export function redirectResponse(path: string, res: Response) {
  res.redirect(301, path);
}

export function notImplementedResponse(res: Response) {
  res.status(501).send();
}
