import { AchievementRepository } from '@etimo-achievements/data';
import { Request, Response } from 'express';
import { getAchievementsListBody, showModal } from './utils';

export class SlackService {
  public async getAllAchievements(req: Request, _res: Response) {
    const achievementRepo = new AchievementRepository();
    console.log(req.body);

    console.log('Fetching achievements');
    const achievements = await achievementRepo.getAll();

    console.log('Creating view');
    const view = getAchievementsListBody(req.body, achievements);

    console.log('Showing modal');
    await showModal(view);
  }

  public async createAchievement(req: Request, res: Response) {
    res.status(501).send('create-achievement not implemented.');
  }
}
