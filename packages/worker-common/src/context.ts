import {
  getRepositories,
  getTransactionRepositories,
  Repositories,
  TransactionRepositories,
} from '@etimo-achievements/data';
import { ILogger, INotifyService, IServiceContext } from '@etimo-achievements/types';
import { DevLogger, NotifyServiceFactory } from '@etimo-achievements/utils';

export type IWorkerContext = {
  repositories: Repositories;
  transactionRepositories: () => Promise<TransactionRepositories>;
} & IServiceContext;

type ContextOptions = {
  logger?: ILogger;
  notifier?: INotifyService;
};

export class WorkerContext implements IWorkerContext {
  public logger: ILogger;
  public notifier: INotifyService;

  constructor(options?: ContextOptions) {
    this.logger = options?.logger ?? new DevLogger();
    this.notifier = options?.notifier ?? NotifyServiceFactory.create('slack', this);
  }

  public get repositories(): Repositories {
    return getRepositories();
  }

  public async transactionRepositories(): Promise<TransactionRepositories> {
    return getTransactionRepositories();
  }
}
