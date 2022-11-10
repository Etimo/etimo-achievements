/**
 * @openapi
 * components:
 *   schemas:
 *     Highscore:
 *       title: Highscore
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         userId:
 *           type: string
 *           format: uuid
 *         achievements:
 *           type: integer
 *           description: How many achievements have been awarded to the user
 *           example: 25
 *         points:
 *           type: integer
 *           description: How many achievement points have been awarded to the user
 *           example: 12000
 *         kickback:
 *           type: integer
 *           description: How many kickback achievement points have been awarded to the user
 *           example: 1200
 *         pointsPerAchievement:
 *           type: integer
 *           description: Total score divided by amount of achievements
 *           example: 528
 *         totalPoints:
 *           type: integer
 *           description: Total points
 *           example: 13200
 *         givenAchievements:
 *           type: integer
 *           description: How many achievements the user have given other users
 *           example: 5
 *         kickbackPerAchievement:
 *           type: integer
 *           description: Total kickback divided by amount of achievements
 *           example: 48
 */
export interface HighscoreDto {
  userId: string;
  achievements: number;
  points: number;
  kickback: number;
  pointsPerAchievement: number;
  totalPoints: number;
  givenAchievements: number;
  kickbackPerAchievement: number;
}
