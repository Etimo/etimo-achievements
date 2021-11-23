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
 *         username:
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
 *         - username
 *         - email
 *         - slackHandle
 */
export interface UserDto {
  id: string;
  username: string;
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
 *         - properties:
 *             password:
 *               type: string
 *               minLength: 8
 *       required:
 *         - password
 */
export interface NewUserDto extends UserDto {
  password: string;
}
