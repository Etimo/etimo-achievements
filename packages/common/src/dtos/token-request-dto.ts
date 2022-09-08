/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     TokenRequest:
 *       title: TokenRequest
 *       type: object
 *       properties:
 *         grant_type:
 *           type: string
 *           enum:
 *             - client_credentials
 *         client_id:
 *           type: string
 *           description: The client id
 *           example: eb64a4dc-02fa-44dd-aa55-026160dcdc6b
 *         client_secret:
 *           type: string
 *           description: The client secret
 *           example: 2e7f1d2b-3ac8-45da-b18f-d12bd52b5f48
 */
export type TokenRequestDto = {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
};
