import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('userAchievements', (table: Knex.TableBuilder) => {
    // Structure
    table.uuid('id').primary();
    table.uuid('achievementId').references('id').inTable('achievements');
    table.uuid('userId').references('id').inTable('users');

    // Timestamps
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('userAchievements');
}
