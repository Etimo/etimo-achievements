/**
 * @openapi
 * components:
 *   schemas:
 *     Achievement:
 *       title: Achievement
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         achievement:
 *           type: string
 *           description: The name of the achievement
 *         description:
 *           type: string
 *           description: A description of when the achievement should be awarded
 *       required:
 *         - achievement
 *         - description
 */
export interface AchievementDto {
  id: string;
  achievement: string;
  description: string;
}
