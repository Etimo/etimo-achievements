import { CookieName, OAuthServiceFactory } from '@etimo-achievements/security';
import { LoginService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';
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
     * /auth/callback/{provider}:
     *   get:
     *     summary: Callback URL for OAuth2 code flow
     *     security: []
     *     operationId: authCallback
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
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Auth
     */
    router.get('/auth/callback/:provider', endpoint(this.callback));

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
}
