import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  console.log('↑ 20220805131240_add_badge_award');
  await knex.schema
    .createTable('badge_awards', (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table.uuid('badge_id').references('id').inTable('badges');
      table.uuid('user_id').references('id').inTable('users');
      table.uuid('awarded_by_user_id').references('id').inTable('users');
      table.unique(['user_id', 'badge_id']);
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('badge_awards'));
}

export async function down(knex: Knex) {
  console.log('↓ 20220805131240_add_badge_award');
  await knex.schema.dropTable('badge_awards');
}
