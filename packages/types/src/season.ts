export interface ISeason {
  id: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
}

export type INewSeason = Omit<ISeason, 'id'>;
export type IPartialSeason = Pick<ISeason, 'id'> & Partial<ISeason>;
