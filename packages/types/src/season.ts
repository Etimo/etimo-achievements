export interface ISeason {
  id: string;
  name: string;
  description: string;
  seasonStart: string;
  seasonEnd: string;
}

export type INewSeason = Omit<ISeason, 'id'>;
export type IPartialSeason = Pick<ISeason, 'id'> & Partial<ISeason>;
