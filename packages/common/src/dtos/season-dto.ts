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
 *           minLength: 3
 *           example: November 2022
 *         startsAt:
 *           type: string
 *           format: date-time
 *           description: When the season starts
 *           example: '2017-01-01T00:00:00Z'
 *         endsAt:
 *           type: string
 *           format: date-time
 *           description: When the season ends
 *           example: '2017-02-01T00:00:00Z'
 *       required:
 *         - name
 *         - startsAt
 */
export interface SeasonDto {
  id: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
}
