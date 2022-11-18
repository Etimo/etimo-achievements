import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20221118184926_add_seasons');
  await knex.schema
    .createTable('seasons', function (table) {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.dateTime('starts_at').notNullable();
      table.dateTime('ends_at');
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('seasons'));
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20221118184926_add_seasons');
  await knex.schema.dropTable('seasons');
}
