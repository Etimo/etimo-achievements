import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20221110140406_global_cooldowns');
  await knex.schema.alterTable('achievements', (table) => {
    table.boolean('global_cooldowns').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20221110140406_global_cooldowns');
  await knex.schema.alterTable('achievements', (table) => {
    table.dropColumn('global_cooldowns');
  });
}
