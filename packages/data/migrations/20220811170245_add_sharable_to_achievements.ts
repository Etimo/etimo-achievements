import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220811170245_add_sharable_to_achievements');
  await knex.schema.alterTable('achievements', (table) => {
    table.boolean('sharable').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220811170245_add_sharable_to_achievements');
  await knex.schema.alterTable('achivements', (table) => {
    table.dropColumn('sharable');
  });
}
