import * as Knex from 'knex';

export async function up(knex: Knex) {
  console.log('↑ 20211210111210_add_cooldown_to_achievement');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.integer('cooldown_minutes').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex) {
  console.log('↓ 20211210111210_add_cooldown_to_achievement');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.dropColumn('cooldown_minutes');
  });
}
