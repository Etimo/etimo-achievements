export interface IDailyScore extends IScore {
  id: string;
  seasonId: string;
  userId: string;
  date: Date;
}

export interface IScore {
  awardsReceived: number;
  awardScore: number;
  awardsGiven: number;
  awardKickbackScore: number;
  totalScore: number;
  scorePerReceivedAward: number;
  scorePerGivenAward: number;
}
