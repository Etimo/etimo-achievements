import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000010_users');
  await knex.schema
    .createTable('users', (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table.string('username', 32).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('email', 128).notNullable().unique();
      table.string('slack_handle', 64).notNullable().unique();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('users'));
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000010_users');
  await knex.schema.dropTable('users');
}
