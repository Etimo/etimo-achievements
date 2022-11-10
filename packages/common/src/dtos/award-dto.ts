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

/**
 * @openapi
 * components:
 *   schemas:
 *     NewAward:
 *       title: NewAward
 *       type: object
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         achievementId:
 *           type: string
 *           format: uuid
 *         awardedByUserId:
 *           type: string
 *           format: uuid
 *       required:
 *         - userIds
 *         - achievementId
 */
export interface NewAwardDto {
  userIds: string[];
  achievementId: string;
  awardedByUserId: string;
}
