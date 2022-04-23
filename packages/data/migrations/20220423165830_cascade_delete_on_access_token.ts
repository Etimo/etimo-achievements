import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220423165830_cascade_delete_on_access_token');
  await knex.schema.alterTable('access_tokens', (table) => {
    table.dropForeign(['user_id']);
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220423165830_cascade_delete_on_access_token');
  await knex.schema.alterTable('access_tokens', (table) => {
    table.dropForeign(['user_id']);
    table.uuid('user_id').notNullable().references('id').inTable('users').alter();
  });
}
