import Knex from 'knex';

export async function up(knex: Knex) {
  console.log('↑ 20210000000005_updated_at_procedure');
  const onUpdateTimestamp = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';`;
  await knex.raw(onUpdateTimestamp);
}

export async function down(knex: Knex) {
  console.log('↓ 20210000000005_updated_at_procedure');
  await knex.raw('DROP FUNCTION on_update_timestamp');
}
