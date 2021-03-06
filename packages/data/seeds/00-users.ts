import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
      name: 'admin',
      email: 'admin@etimo.se',
      slack_handle: '@admin',
    },
    {
      id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
      name: 'user',
      email: 'user@etimo.se',
      slack_handle: '@user',
    },
  ]);
}
