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
 *           example: niclaslindstedt
 *         email:
 *           type: string
 *           format: email
 *           example: niclas.lindstedt@etimo.se
 *         slackHandle:
 *           type: string
 *           description: The @slack handle of the user
 *           example: '@niclas'
 *       required:
 *         - email
 *         - slackHandle
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  slackHandle: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     NewUser:
 *       title: User (for creation)
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 */
export interface NewUserDto extends UserDto {}
