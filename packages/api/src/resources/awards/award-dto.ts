/**
 * @openapi
 * components:
 *   schemas:
 *     Award:
 *       title: Award
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         userId:
 *           type: string
 *           format: uuid
 *         achievementId:
 *           type: string
 *           format: uuid
 *       required:
 *         - userId
 *         - achievementId
 */
export interface AwardDto {
  id: string;
  userId: string;
  achievementId: string;
}
