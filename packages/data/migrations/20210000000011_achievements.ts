import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
const knexFile = require('../src/config/knexfile');

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000011_achievements');
  await knex.schema.createTable('achievements', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.string('achievement', 255).notNullable().unique();
    table.string('description', 255).notNullable();

    // Timestamps
    table.timestamps(false, true);
  });
  await knex.schema.alterTable('achievements', (_table: Knex.TableBuilder) => {
    knex.raw(knexFile.onUpdateTrigger('achievements'));
  });
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000011_achievements');
  await knex.schema.dropTable('achievements');
}
