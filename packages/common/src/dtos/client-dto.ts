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
 *         clientSecret:
 *           type: string
 *         userId:
 *           type: string
 *           format: uuid
 */
export interface ClientDto {
  id: string;
  clientId: string;
  userId: string;
}
