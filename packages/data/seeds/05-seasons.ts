import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('seasons').del();

  // Inserts seed entries
  await knex('seasons').insert([
    {
      id: '5ed2b43e-d2bd-49f2-a275-b21d4709f2d8',
      name: 'November 2022',
      starts_at: '2022-11-01T00:00:00.000Z',
      ends_at: '2022-12-01T00:00:00.000Z',
    },
    {
      id: '445fc5f9-6c44-4fc2-a8b7-1da77f7a86b3',
      name: '2022',
      starts_at: '2022-01-01T00:00:00.000Z',
      ends_at: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 'c63dde49-fa36-4ee4-bd0e-e1f703aa4ce0',
      name: 'All time',
      starts_at: '2022-01-01T00:00:00.000Z',
      ends_at: '2122-01-01T00:00:00.000Z',
    },
  ]);
}
