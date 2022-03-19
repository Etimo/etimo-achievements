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
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRmMGNhNi1mNWI5LTRlMTUtYWFlOC04MWM0NTRmZGZmYjAiLCJzdWIiOiIzZDQxYjVkNC0zMmZhLTQxZDYtOTM5OS01NTFmOThmNWIxMjAiLCJuYW1lIjoiTmljbGFzIExpbmRzdGVkdCIsImVtYWlsIjoibmljbGFzLmxpbmRzdGVkdEBldGltby5zZSIsImlzcyI6ImV0aW1vLWFjaGlldmVtZW50cyIsImF1ZCI6ImV0aW1vLWFjaGlldmVtZW50cyIsImV4cCI6MTY0NzY4OTA5NywiaWF0IjoxNjQ3Njg1NDk3fQ.npzbTJxvdHYF5qYPbAq8cjWReDiQkGbEIEiMCVWNkic
 *         token_type:
 *           type: string
 *           description: The type of token issued.
 *           example: bearer
 *         expires_in:
 *           type: integer
 *           description: In how many seconds the token will expire.
 *           example: 3600
 *         refresh_token:
 *           type: string
 *           description: The refresh token that can be used to get a new access token.
 *           example: V2R3ARQDwpzrLPXhsBZgexPMCp7mPQfsnATPie6h5RCdmmkU4UAqKfWvypPkhbHG
 */
export type AccessTokenDto = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token?: string;
};
