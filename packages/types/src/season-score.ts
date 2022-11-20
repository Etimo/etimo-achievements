import { IScore } from '.';

export interface ISeasonScore extends IScore {
  id: string;
  seasonId: string;
  userId: string;
}
