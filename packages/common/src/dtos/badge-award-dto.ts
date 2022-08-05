/**
 * @openapi
 * components:
 *   schemas:
 *     BadgeAward:
 *       title: BadgeAward
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
 *         badgeId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - userId
 *         - badgeId
 */
export interface BadgeAwardDto {
  id: string;
  userId: string;
  awardedByUserId: string;
  badgeId: string;
  createdAt?: Date;
}
