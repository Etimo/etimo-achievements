import { BaseWorker, WorkerPayload } from '../base-worker';

export type HelloWorldWorkerData = {
  name: string;
};

export class HelloWorldWorker extends BaseWorker<HelloWorldWorkerData> {
  constructor() {
    super({ name: 'hello-world' });
  }

  protected override async processor(payload: WorkerPayload<HelloWorldWorkerData>): Promise<any> {
    console.log(`Hello ${payload.data.name}!`);
  }
}
