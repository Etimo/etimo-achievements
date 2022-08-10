/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       title: User
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         name:
 *           type: string
 *           minLength: 3
 *           example: Niclas Lindstedt
 *         email:
 *           type: string
 *           format: email
 *           example: niclas.lindstedt@etimo.se
 *         slackHandle:
 *           type: string
 *           description: The @slack handle of the user
 *           example: '@niclas'
 *         image:
 *           type: string
 *           description: The url to the user's image
 *           example: 'https://lh3.googleusercontent.com/a/AItbvmmjI2iBhkmtsdRhooDvMuW25VgaZGBA5avYuM9h'
 *           readOnly: true
 *       required:
 *         - name
 *         - email
 *         - slackHandle
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  slackHandle?: string;
  image: string;
}
