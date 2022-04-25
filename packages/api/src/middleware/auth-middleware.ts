import { CookieName, JwtService, RefreshTokenService } from '@etimo-achievements/security';
import { NextFunction, Request, Response } from 'express';
import { getContext } from '../utils';

export const authMiddleware = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    setJwt(req);
    setRefreshToken(req);

    next();
  };
};

function setJwt(req: Request) {
  const ctx = getContext();
  const token = req.signedCookies[CookieName.Jwt];

  try {
    const jwt = JwtService.unlock(token);
    ctx.jwt = jwt;
    ctx.scopes = jwt.scope?.split(' ') ?? [];
  } catch {}
}

function setRefreshToken(req: Request) {
  const ctx = getContext();
  const refreshToken = req.signedCookies[CookieName.RefreshToken];

  if (refreshToken) {
    try {
      const rt = RefreshTokenService.unlock(refreshToken);
      ctx.refreshTokenId = rt.id;
      ctx.refreshTokenKey = rt.key;
    } catch {}
  }
}
