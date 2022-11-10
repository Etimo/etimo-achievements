import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20221110085330_add-self-awardable-field');
  await knex.schema.alterTable('achievements', (table) => {
    table.boolean('self_awardable').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20221110085330_add-self-awardable-field');
  await knex.schema.alterTable('achievements', (table) => {
    table.dropColumn('self_awardable');
  });
}
