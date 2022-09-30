import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('badge_awards').del();

  // Inserts seed entries
  await knex('badge_awards').insert([
    {
      id: 'e03937d6-da19-4151-bb92-9ca6d674fdbb',
      badge_id: '99d9505d-0c58-4af8-b069-08732d423e23',
      user_id: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
      awarded_by_user_id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
    },
    {
      id: 'c4b18f7c-57d1-437d-bf38-fcc3d378bd60',
      badge_id: 'c91e35af-ca36-45ea-a75d-c73da0134961',
      user_id: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
      awarded_by_user_id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
    },
    {
      id: '6aa50a6f-0dfc-4f29-a80e-6e7781bc2485',
      badge_id: '99d9505d-0c58-4af8-b069-08732d423e23',
      user_id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
      awarded_by_user_id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
    },
  ]);
}
