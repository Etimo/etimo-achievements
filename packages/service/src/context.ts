import { Repositories, TransactionRepositories } from '@etimo-achievements/data';
import { IRequestContext } from '@etimo-achievements/types';

export type IContext = {
  repositories: Repositories;
  transactionRepositories: () => Promise<TransactionRepositories>;
} & IRequestContext;

export { getRepositories, Repositories, TransactionRepositories } from '@etimo-achievements/data';
