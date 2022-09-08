/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     AccessToken:
 *       title: AccessToken
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: Bearer access token used for authorization.
 *           example: U2FsdGVkX1/Vvv89nfMwgfO/CG24SnP9LIvf/h8VkbmiRIWa0dDraOuDSAEILlI3+ZvZ...
 *         token_type:
 *           type: string
 *           description: The type of token issued.
 *           example: bearer
 *         expires_in:
 *           type: integer
 *           description: In how many seconds the token will expire.
 *           example: 3600
 *         rt_expires_in:
 *           type: integer
 *           description: In how many seconds the refresh token will expire.
 *           example: 2592000
 *         refresh_token:
 *           type: string
 *           description: The refresh token that can be used to get a new access token.
 *           example: U2FsdGVkX18fnSqv0NhgmH4gkUT+f4VYynZD5WA2hALnLluoop4wa98soXGxUVPcrHMa...
 *         scopes:
 *           type: array
 *           items:
 *             type: string
 *           description: The scopes assigned to the access token.
 *           example: r:achievements rw:awards r:users
 */
export type AccessTokenDto = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  rt_expires_in?: number;
  refresh_token?: string;
  scopes: string[];
};
