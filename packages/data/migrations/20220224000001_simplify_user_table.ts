import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';

export async function up(knex: Knex) {
  Logger.log('↑ 20220224000001_simplify_user_table');
  await knex.schema.alterTable('users', function (table) {
    table.dropColumn('username');
    table.dropColumn('password');
    table.string('name', 255).notNullable().after('id');
  });
}

export async function down(knex: Knex) {
  Logger.log('↓ 20220224000001_simplify_user_table');
  await knex.schema.alterTable('users', function (table) {
    table.string('username', 32).notNullable().unique().after('id');
    table.string('password', 255).notNullable().after('username');
    table.dropColumn('name');
  });
}
