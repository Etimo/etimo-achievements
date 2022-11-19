import { BaseWorker, WorkerPayload } from '../base-worker';
import { IWorkerContext } from '../context';

export type CreateMonthlySeasonWorkerData = {
  name: string;
};

export class CreateMonthlySeasonWorker extends BaseWorker<CreateMonthlySeasonWorkerData> {
  constructor(private context: IWorkerContext) {
    super({
      name: 'create-monthly-season',
      jobsOptions: {
        repeat: {
          // At 00:00 on the first day every month
          //        s m H d M weekday
          pattern: '0 0 0 1 * *',
        },
      },
    });
  }

  protected override async processor(payload: WorkerPayload<CreateMonthlySeasonWorkerData>): Promise<any> {
    const { repositories } = this.context;

    const timestamp = new Date();
    const monthName = timestamp.toLocaleString('en-us', { month: 'long' });
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();

    await repositories.seasons.create({
      name: `${monthName} ${year}`, // example: "November 2022"
      // YYYY, M, D
      startsAt: new Date(year, timestamp.getMonth(), 1),
      // "+1" automatically calculates the date of next month. Year is taken care of
      endsAt: new Date(year, timestamp.getMonth() + 1, 1),
    });

    console.log(`Created monthly season for ${monthName} ${year}`);

    // Create year-season
    // January = 0
    if (month === 0) {
      await repositories.seasons.create({
        name: year.toString(),
        startsAt: new Date(year, 0, 1),
        endsAt: new Date(year + 1, 0, 1),
      });

      console.log(`Created yearly season for ${year}`);
    }
  }
}
