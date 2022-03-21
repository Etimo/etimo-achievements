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
 */
export type AccessTokenValidationDto = {
  expires_in: number;
};