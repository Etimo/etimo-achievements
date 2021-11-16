import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
import { onUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000012_user_achievements');
  await knex.schema.createTable('user_achievements', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.uuid('achievement_id').references('id').inTable('achievements');
    table.uuid('user_id').references('id').inTable('users');

    // Timestamps
    table.timestamps(false, true);
  });
  await knex.schema.alterTable('user_achievements', (_table: Knex.TableBuilder) => {
    knex.raw(onUpdateTrigger('user_achievements'));
  });
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000012_user_achievements');
  await knex.schema.dropTable('user_achievements');
}
