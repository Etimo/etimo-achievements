import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('achievements', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.string('achievement', 255).notNullable().unique();
    table.string('description', 255).notNullable();

    // Timestamps
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('achievements');
}
