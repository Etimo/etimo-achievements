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
 *         awardedByUserId:
 *           type: string
 *           format: uuid
 *         achievementId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - userId
 *         - achievementId
 */
export interface AwardDto {
  id: string;
  userId: string;
  awardedByUserId: string;
  achievementId: string;
  createdAt?: Date;
}
