import { CreateAchievementService, GetAchievementsService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { AchievementMapper } from '.';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validate } from '../../utils/validation-helper';
import { newAchievementValidator } from './achievement-validator';

export type AchievementControllerOptions = {
  createAchievementsService?: CreateAchievementService;
  getAchievementsService: GetAchievementsService;
};

export class AchievementController {
  private createAchievementsService: CreateAchievementService;
  private getAchievementsService: GetAchievementsService;

  constructor(options?: AchievementControllerOptions) {
    this.createAchievementsService = options?.createAchievementsService ?? new CreateAchievementService();
    this.getAchievementsService = options?.getAchievementsService ?? new GetAchievementsService();
  }

  public get routes(): Router {
    const router = Router();
    router.post('/achievements', endpoint(this.createAchievements));
    router.get('/achievements', endpoint(this.getAchievements));
    return router;
  }

  private createAchievements = async (req: Request, res: Response) => {
    const payload = req.body;

    validate(newAchievementValidator, payload, res);

    const input = AchievementMapper.toAchievementDto(payload);
    const achievement = await this.createAchievementsService.create(input);
    const output = AchievementMapper.toAchievementDto(achievement);

    return res.status(201).send(output);
  };

  private getAchievements = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const achievements = await this.getAchievementsService.getAll(skip, take);
    const output = { ...achievements, data: achievements.data.map(AchievementMapper.toAchievementDto) };

    return res.status(200).send(output);
  };
}