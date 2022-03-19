import { UnauthorizedError } from '@etimo-achievements/common';
import { getContext } from '@etimo-achievements/express-middleware';
import { CookieName, OAuthServiceFactory } from '@etimo-achievements/security';
import { LoginService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint, protectedEndpoint } from '../../utils';
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
     *               example: ea-jwt=abcde12345; Path=/; HttpOnly
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
     *     summary: Get token claims
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

    return router;
  }

  private login = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const service = OAuthServiceFactory.create(provider);
    const url = service.getAuthUrl();

    return res.status(301).header({ Location: url, 'Cache-Control': 'no-cache' }).send();
  };

  private callback = async (req: Request, res: Response) => {
    const { provider } = req.params;
    const code = req.query.code?.toString();

    const service = new LoginService(provider);
    const token = await service.login(code!);
    const dto = AccessTokenMapper.toAccessTokenDto(token);

    res.cookie(CookieName.Jwt, dto.access_token, { httpOnly: true });

    return res.status(200).send(dto);
  };

  private userInfo = async (req: Request, res: Response) => {
    const { jwt } = getContext();
    if (!jwt) {
      throw new UnauthorizedError('Not authorized');
    }

    const dto = {
      id: jwt.sub,
      email: jwt.email,
      name: jwt.name,
    } as UserInfoDto;

    return res.status(200).send(dto);
  };
}
