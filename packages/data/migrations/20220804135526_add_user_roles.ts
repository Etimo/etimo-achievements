import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220804135526_add_user_roles');
  await knex.schema.alterTable('users', (table) => {
    table.string('role').defaultTo('user');
  });

  await knex('users')
    .where({ email: 'axel.elmarsson@etimo.se' })
    .orWhere({ email: 'niclas.lindstedt@etimo.se' })
    .update({ role: 'admin' });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220804135526_add_user_roles');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
  });
}
