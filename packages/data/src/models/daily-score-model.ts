import { uuid } from '@etimo-achievements/common';
import { IDailyScore } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class DailyScoreModel extends BaseModel implements IDailyScore {
  static get tableName() {
    return 'daily_score';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['seasonId', 'userId', 'date'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        seasonId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        date: { type: 'date' },
        awardsReceived: { type: 'double' },
        awardScore: { type: 'double' },
        awardsGiven: { type: 'double' },
        awardKickbackScore: { type: 'double' },
        totalScore: { type: 'double' },
        scorePerReceivedAward: { type: 'double' },
        scorePerGivenAward: { type: 'double' },

        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  seasonId!: string;
  userId!: string;
  date!: Date;
  awardsReceived!: number;
  awardScore!: number;
  awardsGiven!: number;
  awardKickbackScore!: number;
  totalScore!: number;
  scorePerReceivedAward!: number;
  scorePerGivenAward!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
