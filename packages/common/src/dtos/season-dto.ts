/**
 * @openapi
 * components:
 *   schemas:
 *     Season:
 *       title: Season
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         name:
 *           type: string
 *           description: The name of the season
 *           maxLength: 255
 *           example: August 2022
 *         description:
 *           type: string
 *           description: The description of the achievement
 *           maxLength: 255
 *         periodStart:
 *           type: string
 *           description: When the season starts
 *           format: date-time
 *         periodEnd:
 *           type: string
 *           description: When the season ends
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - periodStart
 *         - periodEnd
 */
export interface SeasonDto {
  id: string;
  name: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  updatedAt?: Date;
}
