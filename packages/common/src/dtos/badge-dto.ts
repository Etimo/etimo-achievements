/**
 * @openapi
 * components:
 *   schemas:
 *     Badge:
 *       title: Badge
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         name:
 *           type: string
 *           description: The name of the badge
 *           maxLength: 255
 *           example: Åre 2022
 *         description:
 *           type: string
 *           description: A description of when the badge should be awarded
 *           maxLength: 255
 *           example: Åk med Etimo till Åre
 *       required:
 *         - name
 *         - description
 */
export interface BadgeDto {
  id: string;
  name: string;
  description: string;
}
