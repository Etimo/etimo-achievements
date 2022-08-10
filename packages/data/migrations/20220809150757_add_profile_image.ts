import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20220809150757_add_profile_image');
  await knex.schema.alterTable('users', (table) => {
    table.string('image', 255).defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20220809150757_add_profile_image');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('image');
  });
}
