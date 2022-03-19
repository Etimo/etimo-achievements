import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  Logger.log('↑ 20220317202328_access_tokens');
  await knex.schema
    .createTable('access_tokens', function (table) {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users');
      table.string('refresh_token', 64).notNullable().index();
      table.boolean('disabled').notNullable().defaultTo(false);
      table.timestamp('expires_at').notNullable();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('access_tokens'));
}

export async function down(knex: Knex): Promise<void> {
  Logger.log('↓ 20220317202328_access_tokens');
  await knex.schema.dropTable('access_tokens');
}
