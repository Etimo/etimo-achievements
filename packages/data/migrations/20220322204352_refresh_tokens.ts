import * as Knex from 'knex';
import { createOnUpdateTrigger } from '@etimo-achievements/data/src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220322204352_refresh_tokens');
  await knex.schema
    .createTable('refresh_tokens', function (table) {
      table.uuid('id').primary();
      table.text('data');
      table.boolean('disabled').notNullable().defaultTo(false);
      table.boolean('used').notNullable().defaultTo(false);
      table.timestamp('expires_at').notNullable();
      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('refresh_tokens'));
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220322204352_refresh_tokens');
  await knex.schema.dropTable('refresh_tokens');
}
