import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  console.log('↑ 20210000000011_achievements');
  await knex.schema
    .createTable('achievements', (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table.string('achievement', 255).notNullable().unique();
      table.string('description', 255).notNullable();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('achievements'));
}

export async function down(knex: Knex) {
  console.log('↓ 20210000000011_achievements');
  await knex.schema.dropTable('achievements');
}
