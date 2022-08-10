import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220808195526_add_favorite_achievements');
  await knex.schema
    .createTable('achievement_favorites', function (table) {
      table.uuid('id').primary();
      table.uuid('achievement_id').notNullable().references('id').inTable('achievements');
      table.uuid('user_id').notNullable().references('id').inTable('users');
      table.unique(['achievement_id', 'user_id']);
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('achievement_favorites'));
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220808195526_add_favorite_achievements');
  await knex.schema.dropTable('achievement_favorites');
}
