import * as Knex from 'knex';
import { createOnUpdateTrigger } from '../src/utils/knex-helpers';

export async function up(knex: Knex): Promise<void> {
  console.log('↑ 20221119102350_add_highscore');
  await knex.schema
    .createTable('season_score', function (table) {
      table.uuid('id').primary();
      table.uuid('season_id').references('id').inTable('seasons');
      table.uuid('user_id').references('id').inTable('users');
      table.integer('awards_received').defaultTo(0);
      table.double('award_score').defaultTo(0);
      table.integer('awards_given').defaultTo(0);
      table.double('award_kickback_score').defaultTo(0);
      table.double('total_score').defaultTo(0);
      table.double('score_per_received_award').defaultTo(0);
      table.double('score_per_given_award').defaultTo(0);

      // one row per user and season
      table.unique(['season_id', 'user_id']);

      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('season_score'));

  await knex.schema
    .createTable('daily_score', function (table) {
      table.uuid('id').primary();
      table.uuid('season_id').references('id').inTable('seasons');
      table.uuid('user_id').references('id').inTable('users');
      table.date('date').notNullable();
      table.integer('awards_received').defaultTo(0);
      table.double('award_score').defaultTo(0);
      table.integer('awards_given').defaultTo(0);
      table.double('award_kickback_score').defaultTo(0);
      table.double('total_score').defaultTo(0);
      table.double('score_per_received_award').defaultTo(0);
      table.double('score_per_given_award').defaultTo(0);

      // one row per user per day and season
      table.unique(['season_id', 'user_id', 'date']);

      table.timestamps(false, true);
    })
    .raw(createOnUpdateTrigger('daily_score'));
}

export async function down(knex: Knex): Promise<void> {
  console.log('↓ 20221119102350_add_highscore');
  await knex.schema.dropTable('season_score');
  await knex.schema.dropTable('daily_score');
}
