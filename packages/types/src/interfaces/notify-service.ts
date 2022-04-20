export interface INotifyService {
  notify(message: string, prio: 'high' | 'medium' | 'low'): Promise<any>;
}
