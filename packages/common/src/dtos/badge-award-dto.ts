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

/**
 * @openapi
 * components:
 *   schemas:
 *     NewBadgeAward:
 *       title: NewBadgeAward
 *       type: object
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *         badgeId:
 *           type: string
 *           format: uuid
 *       required:
 *         - userIds
 *         - badgeId
 */
export interface NewBadgeAwardDto {
  userIds: string[];
  badgeId: string;
  awardedByUserId: string;
}
