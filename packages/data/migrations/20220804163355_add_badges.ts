import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  console.log('↑ 20220804163355_add_badges');
  await knex.schema
    .createTable('badges', (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable().unique();
      table.string('description', 255).notNullable();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('badges'));
}

export async function down(knex: Knex) {
  console.log('↓ 20220804163355_add_badges');
  await knex.schema.dropTable('badges');
}
