import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20230216162115_add_deleted_at_to_achievements');
  await knex.schema.table('achievements', (table) => {
    table.dateTime('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20230216162115_add_deleted_at_to_achievements');
  await knex.schema.table('achievements', (table) => {
    table.dropColumn('deleted_at');
  });
}
