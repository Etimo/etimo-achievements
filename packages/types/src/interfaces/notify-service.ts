export type NotifyPriority = 'low' | 'medium' | 'high';

export interface INotifyService {
  notify(message: any, subtitle?: string, prio?: NotifyPriority): Promise<any>;
}
