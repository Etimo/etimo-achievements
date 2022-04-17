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
 */
export interface HighscoreDto {
  userId: string;
  achievements: number;
  points: number;
}
