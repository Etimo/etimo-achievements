import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220812103024_add_seasons');
  await knex.schema
    .createTable('seasons', (table) => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('description', 255).notNullable();
      table.timestamp('period_start').notNullable();
      table.timestamp('period_end').notNullable();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('seasons'));
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220812103024_add_seasons');
  await knex.schema.dropTable('seasons');
}
