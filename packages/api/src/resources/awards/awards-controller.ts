import { Request, Response, Router } from 'express';
import { endpoint } from '../../utils';

export type AwardsControllerOptions = {};

export class AwardsController {
  constructor(options?: AwardsControllerOptions) {}

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /awards:
     *   get:
     *     description: Get awards.
     *     security:
     *       - ApiKey: []
     *     parameters:
     *       - $ref: '#/parameters/skipParam'
     *       - $ref: '#/parameters/takeParam'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of awards.
     *     tags:
     *       - Awards
     */
    router.get('/awards', endpoint(this.getAwards));

    /**
     * @openapi
     * /awards:
     *   post:
     *     description: Give a user an award.
     *     security:
     *       - ApiKey: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Award'
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: The award was given to the user.
     *       400:
     *         description: Bad request. The request was badly formed.
     *       404:
     *         description: The achievement or user was not found.
     *     tags:
     *       - Awards
     */
    router.post('/awards', endpoint(this.createAwards));

    return router;
  }

  private createAwards = async (req: Request, res: Response) => {
    return res.status(200).send('Not yet implemented');
  };

  private getAwards = async (req: Request, res: Response) => {
    return res.status(200).send('Not yet implemented');
  };
}
