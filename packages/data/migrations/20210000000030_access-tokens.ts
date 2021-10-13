import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accessTokens', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.string('token', 40).notNullable();
    table.timestamp('expiresAt').notNullable();

    // Timestamps
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table.uuid('userId').nullable().references('id').inTable('users');
    table.uuid('clientId').nullable().references('id').inTable('clients');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tokens');
}
