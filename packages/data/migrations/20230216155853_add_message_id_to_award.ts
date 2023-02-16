import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20230216155853_add_message_id_to_award');
  await knex.schema.table('awards', (table) => {
    table.string('message_id', 64).nullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20230216155853_add_message_id_to_award');
  await knex.schema.table('awards', (table) => {
    table.dropColumn('message_id');
  });
}
