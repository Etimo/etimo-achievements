import { Logger } from '@etimo-achievements/common';
import Knex from 'knex';

export async function up(knex: Knex) {
  Logger.log('↑ 20210000000005_updated_at_procedure');
  const on_update_timestamp = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';`;
  await knex.raw(on_update_timestamp);
}

export async function down(knex: Knex) {
  Logger.log('↓ 20210000000005_updated_at_procedure');
  await knex.raw('DROP FUNCTION on_update_timestamp');
}
