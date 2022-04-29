import { ForbiddenError, getEnvVariable, UnauthorizedError } from '@etimo-achievements/common';
import { NextFunction, Request, Response } from 'express';
import { getContext } from '.';

export function apiKeyEndpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = getEnvVariable('API_KEY');

    if (req.query['apiKey'] !== apiKey) {
      throw new UnauthorizedError('Invalid API key');
    }

    endpointFn(req, res).catch((error) => next(error));
  };
}

export function protectedEndpoint(endpointFn: (req: Request, res: Response) => Promise<any>, scopes?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctx = getContext();

    if (!ctx.jwt) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (scopes && !ctx.scopes?.some((scope) => scopeMatches(scope, scopes))) {
      ctx.logger.warn('User does not have required scopes');
      throw new ForbiddenError('Insufficient scope');
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

export function endpoint(endpointFn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    endpointFn(req, res).catch((error) => next(error));
  };
}
