import { Queue } from 'bullmq';
import * as Worker from './workers';

const workers = {
  helloWorld: new Worker.HelloWorldWorker(),
};

export type Workers = ReturnType<typeof getWorkers>;
export const getWorkers = () => ({
  helloWorld: workers.helloWorld.getWorker(),
});

export const getWorkerQueues = (): Queue[] => {
  const queues: Queue[] = [];
  for (const worker of Object.values(getWorkers())) {
    queues.push(worker.queue);
  }
  return queues;
};
