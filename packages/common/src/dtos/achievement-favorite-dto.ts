/**
 * @openapi
 * components:
 *   schemas:
 *     AchievementFavorite:
 *       title: AchievementFavorite
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         userId:
 *           type: string
 *           format: uuid
 *           readOnly: true
 *         achievementId:
 *           type: string
 *           format: uuid
 *       required:
 *         - achievementId
 */
export interface AchievementFavoriteDto {
  id: string;
  userId: string;
  achievementId: string;
}
