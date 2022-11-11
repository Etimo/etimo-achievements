/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       title: Role
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           example: user
 *         name:
 *           type: string
 *           example: User
 *         description:
 *           type: string
 */
export interface RoleDto {
  key: string;
  name: string;
  description: string;
}
