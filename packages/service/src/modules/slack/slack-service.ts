import { GetAchievementService } from '..';
import { getAcheivementsListBody, showModal } from './utils';
import { Request, Response } from 'express';
import { AchievementRepository } from '@etimo-achievements/data';

export class SlackService {
  public async getAllAchivements(req: Request, _res: Response) {
    const achievementRepo = new AchievementRepository();
    console.log(req.body);

    console.log('Fetching achievements');
    const achievements = await achievementRepo.getAll();

    console.log('Creating view');
    const view = getAcheivementsListBody(req.body, achievements);

    console.log('Showing modal');
    await showModal(view);
  }

  public async createAchievement(req: Request, res: Response) {
    res.status(200).send('create-achievement not implemented.');
  }
}
