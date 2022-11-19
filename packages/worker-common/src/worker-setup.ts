import { Queue } from 'bullmq';
import { WorkerContext } from './context';
import * as Worker from './workers';

const context = new WorkerContext();

const workers = {
  helloWorld: new Worker.HelloWorldWorker(context),
  clearExpiredTokens: new Worker.ClearExpiredTokensWorker(context),
  createMonthlySeason: new Worker.CreateMonthlySeasonWorker(context),
};

export type Workers = ReturnType<typeof getWorkers>;
export const getWorkers = () => ({
  helloWorld: workers.helloWorld.getWorker(context),
  clearExpiredTokens: workers.clearExpiredTokens.getWorker(context),
  createMonthlySeason: workers.createMonthlySeason.getWorker(context),
});

export const getWorkerQueues = (): Queue[] => {
  const queues: Queue[] = [];
  for (const worker of Object.values(getWorkers())) {
    queues.push(worker.queue);
  }
  return queues;
};
