/**
 * @openapi
 * components:
 *   schemas:
 *     Client:
 *       title: Client
 *       type: object
 *       properties:
 *         id:
 *           *idProperty
 *         name:
 *           type: string
 *           description: The name of the client
 *           maxLength: 255
 *           example: magic_mirror
 *         description:
 *           type: string
 *           description: A description of the client
 *           maxLength: 255
 *           example: Klienten för min magiska spegel i kontoret
 *         userId:
 *           type: string
 *           format: uuid
 *           readOnly: true
 *         scope:
 *           type: string
 *           example: "r:awards crud:badges"
 *         clientSecret:
 *           type: string
 *           readOnly: true
 *       required:
 *         - name
 *         - description
 *         - userId
 *         - scope
 *         - clientSecret
 */
export interface ClientDto {
  id: string;
  name: string;
  description: string;
  userId: string;
  scope: string;
  clientSecret: string;
}
