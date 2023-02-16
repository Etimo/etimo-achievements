import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('awards').insert([
    {
      id: '70f3cb6d-9395-4c08-8c5e-4b5ec8e07f27',
      achievement_id: '44fad392-2016-4916-9fcf-a7680d31c609',
      user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
      awarded_by_user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
    },
    {
      id: 'ebfebd4b-079b-444c-b422-6e20dd25b71f',
      achievement_id: '44fad392-2016-4916-9fcf-a7680d31c609',
      user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
      awarded_by_user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
    },
  ]);
}
