import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  Logger.log('↑ 20220224150002_add_awardedByUserId_to_award');
  await knex.schema.table('awards', (table) => {
    table.uuid('awarded_by_user_id').references('id').inTable('users').after('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  Logger.log('↓ 20220224150002_add_awardedByUserId_to_award');
  await knex.schema.table('awards', (table) => {
    table.dropColumn('awarded_by_user_id');
  });
}
