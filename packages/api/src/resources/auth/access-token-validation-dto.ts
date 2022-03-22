/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     AccessTokenValidation:
 *       title: AccessTokenValidation
 *       type: object
 *       properties:
 *         expires_in:
 *           type: integer
 *           description: In how many seconds the token will expire.
 *           example: 3600
 *         scopes:
 *           type: array
 *           items:
 *             type: string
 *           description: The scopes assigned to the access token.
 *           example: r:achievements rw:awards r:users
 */
export type AccessTokenValidationDto = {
  expires_in: number;
  scopes: string;
};
