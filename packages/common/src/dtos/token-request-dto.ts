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
 *           example: 89bbe48f-9465-44fa-822c-b7d927bcd854
 *         client_secret:
 *           type: string
 *           description: The client secret
 *           example: LCS6beLLAF9nDD8axbp586WPPfZV26WM
 */
export type TokenRequestDto = {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
};
