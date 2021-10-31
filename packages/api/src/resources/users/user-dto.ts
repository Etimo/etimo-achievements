/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       title: User
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         slackHandle:
 *           type: string
 *           description: The @slack handle of the user
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
 *         - required:
 *           - password
 */
export interface NewUserDto extends UserDto {
  password: string;
}
