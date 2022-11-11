import { BaseWorker, WorkerPayload } from '../base-worker';
import { IWorkerContext } from '../context';

export type HelloWorldWorkerData = {
  name: string;
};

export class HelloWorldWorker extends BaseWorker<HelloWorldWorkerData> {
  constructor(private context: IWorkerContext) {
    super({ name: 'hello-world' });
  }

  protected override async processor(payload: WorkerPayload<HelloWorldWorkerData>): Promise<any> {
    const { repositories } = this.context;

    const users = await repositories.user.getAll();

    console.log(`Hello ${payload.data.name}!`);
    console.log(`Users: ${users.length}!`);
  }
}
