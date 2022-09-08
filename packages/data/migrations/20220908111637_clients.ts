import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220908111637_clients');
  await knex.schema.createTable('clients', (table: Knex.TableBuilder) => {
    table.uuid('id').primary();
    table.string('client_secret', 255).notNullable();
    table.uuid('userId').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220908111637_clients');
  await knex.schema.dropTable('clients');
}
