import { BaseWorker, WorkerPayload } from '../base-worker';

export type HelloWorldWorkerData = {
  name: string;
};

export class HelloWorldWorker extends BaseWorker<HelloWorldWorkerData> {
  constructor({}) {
    super({ name: 'hello-world' });
  }

  protected override async processor(payload: WorkerPayload<HelloWorldWorkerData>): Promise<any> {
    const { context } = payload;

    const users = await context.repositories.user.getAll();

    console.log(`Hello ${payload.data.name}!`);
    console.log(`Users: ${users.length}}!`);
  }
}
