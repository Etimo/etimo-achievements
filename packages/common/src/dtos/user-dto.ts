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
 *           example: 'moderator'
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
  role: string;
}
