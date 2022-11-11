import { getDefaultRedisClient } from '@etimo-achievements/utils';
import { Job, JobsOptions, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq';
import { IWorkerContext } from './context';

export type IWorker<TType, TData> = {
  name: string;
  init: () => TType;
  queue: Queue;
  push: (data: TData) => void;
};

export type WorkerPayload<T> = {
  data: T;
};

type BaseWorkerOptions = {
  name: string;
  queueOptions?: QueueOptions;
  workerOptions?: WorkerOptions;
  jobsOptions?: JobsOptions;
};

export abstract class BaseWorker<TData> {
  private initialized: boolean = false;
  private worker?: Worker;

  constructor(private options: BaseWorkerOptions) {}

  public initialize(): this {
    if (this.initialized) return this;

    const workerOptions: WorkerOptions = {
      connection: getDefaultRedisClient(),
      ...this.options.workerOptions,
    };
    const queueOptions: QueueOptions = { connection: getDefaultRedisClient(), ...this.options.queueOptions };

    if (this.options.jobsOptions?.repeat) {
      const queue = new Queue(this.options.name, queueOptions);
      queue.add(this.options.name, undefined, this.options.jobsOptions);
    }

    this.worker = new Worker(
      this.options.name,
      async (job: Job<WorkerPayload<TData>>) => {
        return this.processor(job.data);
      },
      workerOptions
    );

    this.worker.on('failed', this.onFailed);

    this.initialized = true;

    console.log(`Worker ${this.options.name} initialized`);

    return this;
  }

  public getWorker(context?: IWorkerContext): IWorker<this, TData> {
    const queueOptions: QueueOptions = { connection: getDefaultRedisClient(), ...this.options.queueOptions };
    const queue = new Queue(this.options.name, queueOptions);

    return {
      name: `${this.options.name}`,
      init: () => this.initialize(),
      queue,
      push: (data: TData) => {
        console.log(`Enqueuing job to worker ${this.options.name}`);

        queue.add(this.options.name, { context, data: data });
      },
    };
  }

  protected abstract processor(payload: WorkerPayload<TData>): Promise<any>;

  protected onFailed(job: Job<WorkerPayload<TData>>, error: Error) {
    console.log(`${job.name} has failed: ${error.message}`);
  }
}
