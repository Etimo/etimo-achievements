import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
const knexFile = require('../src/config/knexfile');

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000012_user_achievements');
  await knex.schema.createTable('userAchievements', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.uuid('achievementId').references('id').inTable('achievements');
    table.uuid('userId').references('id').inTable('users');

    // Timestamps
    table.timestamps(false, true);
  });
  await knex.schema.alterTable('userAchievements', (_table: Knex.TableBuilder) => {
    knex.raw(knexFile.onUpdateTrigger('userAchievements'));
  });
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000012_user_achievements');
  await knex.schema.dropTable('userAchievements');
}
