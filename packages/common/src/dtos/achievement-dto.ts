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
 *         name:
 *           type: string
 *           description: The name of the achievement
 *           maxLength: 255
 *           example: Coffee Achievement
 *         description:
 *           type: string
 *           description: A description of when the achievement should be awarded
 *           maxLength: 255
 *           example: Put on coffee for the gang.
 *         achievementPoints:
 *           type: integer
 *           description: How many achievement points that should be awarded when this achievement is achieved
 *           example: 500
 *         cooldownMinutes:
 *           type: integer
 *           description: Minutes until the this achievement becomes available again after awarding it
 *           example: 15
 *           default: 0
 *       required:
 *         - name
 *         - description
 *         - achievementPoints
 */
export interface AchievementDto {
  id: string;
  name: string;
  description: string;
  achievementPoints: number;
  cooldownMinutes: number;
}
