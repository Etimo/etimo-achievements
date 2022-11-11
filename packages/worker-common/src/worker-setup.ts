import { Queue } from 'bullmq';
import { WorkerContext } from './context';
import * as Worker from './workers';

const context = new WorkerContext();

const workers = {
  helloWorld: new Worker.HelloWorldWorker(context),
};

export type Workers = ReturnType<typeof getWorkers>;
export const getWorkers = () => ({
  helloWorld: workers.helloWorld.getWorker(context),
});

export const getWorkerQueues = (): Queue[] => {
  const queues: Queue[] = [];
  for (const worker of Object.values(getWorkers())) {
    queues.push(worker.queue);
  }
  return queues;
};
