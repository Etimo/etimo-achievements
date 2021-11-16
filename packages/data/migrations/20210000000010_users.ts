import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
const knexFile = require('../src/config/knexfile');

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000010_users');
  await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.string('username', 32).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('email', 128).notNullable().unique();
    table.string('slackHandle', 64).notNullable().unique();

    // Timestamps
    table.timestamps(false, true);
  });
  await knex.schema.alterTable('users', (_table: Knex.TableBuilder) => {
    knex.raw(knexFile.onUpdateTrigger('users'));
  });
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000010_users');
  await knex.schema.dropTable('users');
}
