import {
  AccessTokenDto,
  getEnvVariable,
  TokenValidationDto,
  UnauthorizedError,
  UserInfoDto,
} from '@etimo-achievements/common';
import { CookieName, OAuthServiceFactory } from '@etimo-achievements/security';
import { LoginResponse, LoginService, LogoutService, RefreshLoginService } from '@etimo-achievements/service';
import { Env } from '@etimo-achievements/types';
import { Request, Response, Router } from 'express';
import { endpoint, getContext, okResponse, protectedEndpoint, redirectResponse } from '../../utils';
import { AccessTokenMapper } from './access-token-mapper';

export class AuthController {
  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /auth/login/{provider}:
     *   get:
     *     summary: Start a login request
     *     operationId: authLogin
     *     security: []
     *     parameters:
     *       - *providerParam
     *     responses:
     *       301:
     *         description: Redirection to OAuth2 service.
     *         headers:
     *           Location:
     *             description: URI to OAuth2 token endpoint.
     *             schema:
     *               type: string
     *               format: uri
     *     tags:
     *       - Auth
     */
    router.get('/auth/login/:provider', endpoint(this.login));

    /**
     * @openapi
     * /auth/refresh:
     *   get:
     *     summary: Renew access token
     *     operationId: authRefresh
     *     security:
     *       - refreshTokenCookie: []
     *     responses:
     *       200:
     *         description: Authentication success.
     *         content: *accessTokenContent
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: ea-jwt=abcde12345; Path=/; Secure; HttpOnly, ea-rt=abcde12345; Path=/; Secure; HttpOnly
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/refresh', endpoint(this.refresh));

    /**
     * @openapi
     * /auth/logout:
     *   get:
     *     summary: Logout
     *     operationId: authLogout
     *     responses:
     *       200:
     *         description: Logout success.
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: ea-jwt=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT, ea-rt=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
     *     tags:
     *       - Auth
     */
    router.get('/auth/logout', endpoint(this.logout));

    /**
     * @openapi
     * /auth/callback/{provider}:
     *   get:
     *     summary: Callback URL for OAuth2 code flow
     *     operationId: authCallback
     *     security: []
     *     x-allow-unknown-query-parameters: true
     *     parameters:
     *       - *providerParam
     *       - name: code
     *         in: query
     *         description: The OAuth2 code to exchange for an access token.
     *         required: true
     *         schema:
     *           type: string
     *         allowReserved: true
     *     responses:
     *       200:
     *         description: Authentication success.
     *         content: *accessTokenContent
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: ea-jwt=abcde12345; Path=/; Secure; HttpOnly, ea-rt=abcde12345; Path=/; Secure; HttpOnly
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/callback/:provider', endpoint(this.callback));

    /**
     * @openapi
     * /auth/userinfo:
     *   get:
     *     summary: Get userinfo from token
     *     operationId: authUserInfo
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *userInfoContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/userinfo', protectedEndpoint(this.userInfo));

    /**
     * @openapi
     * /auth/validate:
     *   get:
     *     summary: Validate JWT token
     *     operationId: authValidate
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *tokenValidationContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/validate', protectedEndpoint(this.validate));

    /**
     * @openapi
     * /auth/introspect:
     *   get:
     *     summary: Token introspection
     *     operationId: authIntrospect
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *tokenInfoContent
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/introspect', protectedEndpoint(this.introspect));

    return router;
  }

  private login = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const service = OAuthServiceFactory.create(provider);
    const url = service.getAuthUrl();

    return redirectResponse(res, url);
  };

  private refresh = async (_req: Request, res: Response) => {
    const { refreshTokenId, refreshTokenKey } = getContext();
    if (refreshTokenId && refreshTokenKey) {
      const service = new RefreshLoginService(getContext());
      const loginResponse = await service.refresh(refreshTokenId, refreshTokenKey);
      const dto = AccessTokenMapper.toAccessTokenDto(loginResponse);

      this.setCookies(res, dto, loginResponse);

      return okResponse(res, dto);
    }

    throw new UnauthorizedError('No refresh token');
  };

  private logout = async (_req: Request, res: Response) => {
    const { jwt, refreshTokenId } = getContext();
    if (jwt) {
      const service = new LogoutService(getContext());
      await service.logout(jwt, refreshTokenId);
    }

    const domain = new URL(getEnvVariable(Env.FRONTEND_URL)).hostname;
    const deleteCookie = (name: string) => {
      res.cookie(name, 'deleted', {
        domain,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(0),
      });
    };

    deleteCookie(CookieName.Jwt);
    deleteCookie(CookieName.RefreshToken);

    return okResponse(res);
  };

  private callback = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const code = req.query.code?.toString();

    const service = new LoginService(provider, getContext());
    const loginResponse = await service.login(code!);
    const dto = AccessTokenMapper.toAccessTokenDto(loginResponse);

    this.setCookies(res, dto, loginResponse);

    return okResponse(res, dto);
  };

  private userInfo = async (_req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) {
      throw new UnauthorizedError('Not authorized');
    }

    const dto = {
      id: jwt.sub,
      email: jwt.email,
      name: jwt.name,
    } as Partial<UserInfoDto>;

    return okResponse(res, dto);
  };

  private validate = async (_req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) throw new UnauthorizedError('Not authorized');

    const dto: TokenValidationDto = {
      expires_in: Math.floor(jwt.exp - new Date().getTime() / 1000),
    };

    return okResponse(res, dto);
  };

  private introspect = async (_req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) throw new UnauthorizedError('Not authorized');

    const dto = AccessTokenMapper.toTokenInfoDto(jwt);

    return okResponse(res, dto);
  };

  private setCookies(res: Response, dto: AccessTokenDto, loginResponse: LoginResponse) {
    const domain = new URL(getEnvVariable(Env.FRONTEND_URL)).hostname;

    const setCookie = (name: string, expiresAt: Date, data: any) => {
      res.cookie(name, data, {
        domain,
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: 'strict',
        expires: expiresAt,
      });
    };

    setCookie(CookieName.Jwt, loginResponse.expiresAt, dto.access_token);
    setCookie(CookieName.RefreshToken, loginResponse.refreshTokenExpiresAt, dto.refresh_token);
  }
}
