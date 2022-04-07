/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     TokenInfo:
 *       title: TokenInfo
 *       type: object
 *       properties:
 *         active:
 *           type: boolean
 *           description: If the token is active
 *           example: true
 *         scope:
 *           type: string
 *           description: The scopes assigned to the token.
 *           example: r:achievements rw:awards r:users
 *         username:
 *           type: string
 *           description: The username of the owner of the token.
 *           example: niclas.lindstedt@etimo.se
 *         token_type:
 *           type: string
 *           description: The type of token.
 *           example: bearer
 *         jti:
 *           type: string
 *           format: uuid
 *           description: A unique identifier for the token.
 *           example: fe893f86-4107-472e-b34e-c4a9abb06fc5
 *         sub:
 *           type: string
 *           format: uuid
 *           description: The subject of the token (usually the userId).
 *           example: 572c51c0-6dd4-4ef8-90da-b7aac0ef6846
 *         iss:
 *           type: string
 *           description: The issuer of the token.
 *           example: etimo-achievements
 *         aud:
 *           type: string
 *           description: The audience of the token.
 *           example: etimo-achievements
 *         exp:
 *           type: number
 *           description: The unix timestamp when the token expires.
 *           example: 1647954723
 *         iat:
 *           type: number
 *           description: The unix timestamp when the token was issued.
 *           example: 1647951123
 */
export type TokenInfoDto = {
  active: boolean;
  scope: string;
  username: string;
  token_type: string;
  jti: string;
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
};
