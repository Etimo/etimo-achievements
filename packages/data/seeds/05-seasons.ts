import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('seasons').del();

  // Inserts seed entries
  await knex('seasons').insert([
    {
      id: '5ed2b43e-d2bd-49f2-a275-b21d4709f2d8',
      name: 'February 2023',
      starts_at: '2023-02-01T00:00:00.000Z',
      ends_at: '2023-03-01T00:00:00.000Z',
    },
    {
      id: '9977d1bf-5888-463e-b0c4-d39ce5b12fa1',
      name: 'April 2023',
      starts_at: '2023-04-01T00:00:00.000Z',
      ends_at: '2023-05-01T00:00:00.000Z',
    },
    {
      id: '0edb6232-d621-4a31-853f-e433c91f5ca5',
      name: 'June 2023',
      starts_at: '2023-06-01T00:00:00.000Z',
      ends_at: '2023-07-01T00:00:00.000Z',
    },
    {
      id: '416d3958-19d9-4162-8d17-db8172e90ba3',
      name: 'August 2023',
      starts_at: '2023-08-01T00:00:00.000Z',
      ends_at: '2023-09-01T00:00:00.000Z',
    },
    {
      id: '45c59113-0abd-47de-911d-d79725d10674',
      name: 'October 2023',
      starts_at: '2023-10-01T00:00:00.000Z',
      ends_at: '2023-11-01T00:00:00.000Z',
    },
    {
      id: '317babf8-0701-4345-8e0d-d9a2e87762a9',
      name: 'December 2023',
      starts_at: '2023-12-01T00:00:00.000Z',
      ends_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '445fc5f9-6c44-4fc2-a8b7-1da77f7a86b3',
      name: '2023',
      starts_at: '2023-01-01T00:00:00.000Z',
      ends_at: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'c63dde49-fa36-4ee4-bd0e-e1f703aa4ce0',
      name: 'All time',
      starts_at: '2022-01-01T00:00:00.000Z',
      ends_at: '2122-01-01T00:00:00.000Z',
    },
  ]);
}
