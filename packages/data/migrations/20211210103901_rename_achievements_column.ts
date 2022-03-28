import * as Knex from 'knex';

export async function up(knex: Knex) {
  console.log('↑ 20211210103901_rename_achievements_column');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.renameColumn('achievement', 'name');
  });
}

export async function down(knex: Knex) {
  console.log('↓ 20211210103901_rename_achievements_column');
  await knex.schema.alterTable('achievements', (table: Knex.TableBuilder) => {
    table.renameColumn('name', 'achievement');
  });
}
