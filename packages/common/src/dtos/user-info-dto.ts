/* eslint-disable */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserInfo:
 *       title: UserInfo
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user's id.
 *           example: 238ec288-ffc2-41ad-918b-7aa1f4f855dd
 *         email:
 *           type: string
 *           description: The user's e-mail.
 *           example: niclas.lindstedt@etimo.se
 *         verified_email:
 *           type: boolean
 *           description: Whether the e-mail has been verified or not.
 *           example: true
 *         name:
 *           type: string
 *           description: The user's full name.
 *           example: Niclas Lindstedt
 *         given_name:
 *           type: string
 *           description: The user's given name.
 *           example: Niclas
 *         family_name:
 *           type: string
 *           description: The user's family name.
 *           example: Lindstedt
 *         picture:
 *           type: string
 *           description: An url to the user's picture.
 *           example: https://picsum.photos/200
 *         hd:
 *           type: string
 *           description: The hosted domain of the user.
 *           example: etimo.se
 */
export type UserInfoDto = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  hd: string;
};
