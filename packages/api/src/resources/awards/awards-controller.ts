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
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         in: formData
     *         required: true
     *         type: string
     *       - name: achievementId
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: User given award.
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
