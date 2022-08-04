import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220804135526_add_user_roles');
  await knex.schema.alterTable('users', (table) => {
    table.string('role').defaultTo('user');
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220804135526_add_user_roles');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
  });
}
