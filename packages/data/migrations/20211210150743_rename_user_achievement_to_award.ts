import { Logger } from '@etimo-achievements/common';
import * as Knex from 'knex';

export async function up(knex: Knex) {
  Logger.log('↑ 20211210150743_rename_user_achievement_to_award');
  await knex.schema.renameTable('user_achievements', 'awards');
}

export async function down(knex: Knex) {
  Logger.log('↓ 20211210150743_rename_user_achievement_to_award');
  await knex.schema.renameTable('awards', 'user_achievements');
}
