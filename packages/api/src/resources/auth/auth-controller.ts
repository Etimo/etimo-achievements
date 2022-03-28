import { getEnvVariable, Logger, UnauthorizedError } from '@etimo-achievements/common';
import { getContext } from '@etimo-achievements/express-middleware';
import { CookieName, encrypt, OAuthServiceFactory } from '@etimo-achievements/security';
import { LoginResponse, LoginService, LogoutService, RefreshLoginService } from '@etimo-achievements/service';
import { Env } from '@etimo-achievements/types';
import { Request, Response, Router } from 'express';
import { endpoint, protectedEndpoint } from '../../utils';
import { AccessTokenDto } from './access-token-dto';
import { AccessTokenMapper } from './access-token-mapper';
import { UserInfoDto } from './user-info-dto';

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
     *       - cookieAuth: []
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
    router.get('/auth/refresh', protectedEndpoint(this.refresh));

    /**
     * @openapi
     * /auth/logout:
     *   get:
     *     summary: Logout
     *     operationId: authLogout
     *     security:
     *       - cookieAuth: []
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
    router.get('/auth/logout', protectedEndpoint(this.logout));

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
     *       - cookieAuth: []
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
     *       - cookieAuth: []
     *     responses:
     *       200: *okResponse
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
     *       - cookieAuth: []
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

    return res.status(301).header({ Location: url, 'Cache-Control': 'no-cache' }).send();
  };

  private refresh = async (_req: Request, res: Response) => {
    const { refreshTokenId, refreshTokenKey } = getContext();
    if (refreshTokenId && refreshTokenKey) {
      const service = new RefreshLoginService();
      const loginResponse = await service.refresh(refreshTokenId, refreshTokenKey);
      const dto = AccessTokenMapper.toAccessTokenDto(loginResponse);

      this.setCookies(res, dto, loginResponse);

      return res.status(200).send(dto);
    }

    throw new UnauthorizedError('No refresh token');
  };

  private logout = async (_req: Request, res: Response) => {
    const { jwt, refreshTokenId } = getContext();
    if (jwt) {
      const service = new LogoutService();
      await service.logout(jwt, refreshTokenId);
    }

    res.cookie(CookieName.Jwt, 'deleted', { expires: new Date(0) });
    res.cookie(CookieName.RefreshToken, 'deleted', { expires: new Date(0) });

    return res.status(200).send();
  };

  private callback = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const code = req.query.code?.toString();

    const service = new LoginService(provider);
    const loginResponse = await service.login(code!);
    const dto = AccessTokenMapper.toAccessTokenDto(loginResponse);

    this.setCookies(res, dto, loginResponse);

    return res.status(200).send(dto);
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

    return res.status(200).send(dto);
  };

  private validate = async (_req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) throw new UnauthorizedError('Not authorized');

    return res.status(200).send({
      expires_in: Math.floor(jwt.exp - new Date().getTime() / 1000),
    });
  };

  private introspect = async (_req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) throw new UnauthorizedError('Not authorized');

    const dto = AccessTokenMapper.toTokenInfoDto(jwt);

    return res.status(200).send(dto);
  };

  private setCookies(res: Response, dto: AccessTokenDto, loginResponse: LoginResponse) {
    const domain = this.getCookieDomain();

    Logger.log(`Creating cookie ${CookieName.Jwt} @ ${domain} with expiration date ${loginResponse.expiresAt}`);
    res.cookie(CookieName.Jwt, encrypt(dto.access_token), {
      domain,
      signed: true,
      httpOnly: true,
      secure: true,
      expires: loginResponse.expiresAt,
    });

    Logger.log(
      `Creating cookie ${CookieName.RefreshToken} @ ${domain} with expiration date ${loginResponse.refreshTokenExpiresAt}`
    );
    res.cookie(CookieName.RefreshToken, encrypt(dto.refresh_token), {
      domain,
      signed: true,
      httpOnly: true,
      secure: true,
      expires: loginResponse.refreshTokenExpiresAt,
    });
  }

  private getCookieDomain() {
    const url = new URL(getEnvVariable(Env.FRONTEND_URL));
    return url.host;
  }
}
