import { Role } from '@etimo-achievements/types';

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
 *         role:
 *           type: string
 *           description: The role of the user
 *           example: 'user'
 *         image:
 *           type: string
 *           description: The url to the user's image
 *           example: 'https://lh3.googleusercontent.com/a/AItbvmmjI2iBhkmtsdRhooDvMuW25VgaZGBA5avYuM9h'
 *           readOnly: true
 *       required:
 *         - name
 *         - email
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  slackHandle?: string;
  role: Role;
  image: string;
}
