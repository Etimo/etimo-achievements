/**
 * @openapi
 * components:
 *   schemas:
 *     Achievement:
 *       title: Achievement
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         achievement:
 *           type: string
 *           description: The name of the achievement
 *           example: Coffee Achievement
 *         description:
 *           type: string
 *           description: A description of when the achievement should be awarded
 *           example: Put on coffee for the gang.
 *       required:
 *         - achievement
 *         - description
 */
export interface AchievementDto {
  id: string;
  achievement: string;
  description: string;
}
