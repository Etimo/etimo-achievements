import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  Logger.log('↑ 20220322085054_access_token_scopes');
  await knex.schema.table('access_tokens', (table) => {
    table.string('scopes').defaultTo('[]');
  });
}

export async function down(knex: Knex): Promise<void> {
  Logger.log('↓ 20220322085054_access_token_scopes');
  await knex.schema.table('access_tokens', (table) => {
    table.dropColumn('scopes');
  });
}
