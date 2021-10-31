/**
 * @openapi
 * components:
 *   schemas:
 *     Award:
 *       title: Award
 *       type: object
 *       properties:
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
  userId: string;
  achievementId: string;
}
