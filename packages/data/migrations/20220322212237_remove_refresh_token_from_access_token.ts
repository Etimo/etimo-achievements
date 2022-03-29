import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220322212237_remove_refresh_token_from_access_token');
  await knex.schema.table('access_tokens', (table) => {
    table.dropColumn('refresh_token');
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220322212237_remove_refresh_token_from_access_token');
  await knex.schema.table('access_tokens', (table) => {
    table.string('refresh_token', 64).notNullable().index();
  });
}
