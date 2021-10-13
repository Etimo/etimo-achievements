import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('clients', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.string('secret', 128).notNullable();
    table.string('redirectUris', 255).notNullable();
    table.string('grants', 64).notNullable();

    // Timestamps
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table.uuid('userId').notNullable().references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('clients');
}
