/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     TokenValidation:
 *       title: TokenValidation
 *       type: object
 *       properties:
 *         expires_in:
 *           type: integer
 *           description: In how many seconds the token will expire.
 *           example: 3600
 */
export type TokenValidationDto = {
  expires_in: number;
};
