export type NotifyPriority = 'low' | 'medium' | 'high';

export type NotifyServiceOptions = {
  subtitle?: string;
  prio?: NotifyPriority;
};

export interface INotifyService {
  notify(message: any, options?: NotifyServiceOptions): Promise<any>;
}
