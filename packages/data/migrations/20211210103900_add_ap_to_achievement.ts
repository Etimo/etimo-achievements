import * as Knex from 'knex';

export async function up(knex: Knex) {
  console.log('↑ 20211210103900_add_ap_to_achievement');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.integer('achievement_points').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex) {
  console.log('↓ 20211210103900_add_ap_to_achievement');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.dropColumn('achievement_points');
  });
}
