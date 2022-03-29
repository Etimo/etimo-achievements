import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  console.log('↑ 20210000000012_user_achievements');
  await knex.schema
    .createTable('user_achievements', (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table.uuid('achievement_id').references('id').inTable('achievements');
      table.uuid('user_id').references('id').inTable('users');
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('user_achievements'));
}

export async function down(knex: Knex) {
  console.log('↓ 20210000000012_user_achievements');
  await knex.schema.dropTable('user_achievements');
}
