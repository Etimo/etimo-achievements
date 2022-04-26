export type NotifyPriority = 'low' | 'medium' | 'high';

export interface INotifyService {
  notify(message: string, prio?: NotifyPriority): Promise<any>;
}
