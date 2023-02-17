import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20230216163447_client_scopes');
  await knex.schema.alterTable('clients', (table: Knex.TableBuilder) => {
    table.string('scope', 256).notNullable();
    table.string('name', 256).notNullable();
    table.string('description', 256).notNullable();
    table.renameColumn('userId', 'user_id');
    table.unique(['name', 'user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20230216163447_client_scopes');
  await knex.schema.alterTable('clients', (table: Knex.TableBuilder) => {
    table.dropColumns('scope', 'name', 'description');
  });
}
