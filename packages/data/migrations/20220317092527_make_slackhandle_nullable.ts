import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220317092527_make_slackhandle_nullable');
  await knex.schema.table('users', (table) => {
    table.string('slack_handle', 64).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220317092527_make_slackhandle_nullable');
  await knex.schema.table('users', (table) => {
    table.string('slack_handle', 64).notNullable().alter();
  });
}
