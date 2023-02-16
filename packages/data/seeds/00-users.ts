import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('daily_score').del();
  await knex('season_score').del();
  await knex('seasons').del();
  await knex('awards').del();
  await knex('badge_awards').del();
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
      name: 'admin',
      email: 'admin@etimo.se',
      slack_handle: '@admin',
      role: 'admin',
    },
    {
      id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
      name: 'Niclas Lindstedt',
      email: 'niclas.lindstedt@etimo.se',
      slack_handle: 'URS4S1WH5',
      role: 'admin',
    },
    {
      id: '537574f5-605d-491e-bd23-108e373aa8ca',
      name: 'Axel Elmarsson',
      email: 'axel.elmarsson@etimo.se',
      slack_handle: 'U03QM7ZM81X',
      role: 'admin',
    },
  ]);
}
