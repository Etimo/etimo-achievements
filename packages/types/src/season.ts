export interface ISeason {
  id: string;
  name: string;
  description: string;
  periodStart: Date;
  periodEnd: Date;
}

export type INewSeason = Omit<ISeason, 'id'>;
export type IPartialSeason = Pick<ISeason, 'id'> & Partial<ISeason>;
