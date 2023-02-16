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
    {
      id: 'b37c6aed-73d7-46f2-b090-d021fc234e3d',
      achievement_id: 'ea363ba1-e037-4c3c-a8ed-d393e2539e2f',
      user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
      awarded_by_user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
    },
    {
      id: '646e9214-ab94-40e3-90ed-56ed02c7c4b3',
      achievement_id: 'ea363ba1-e037-4c3c-a8ed-d393e2539e2f',
      user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
      awarded_by_user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
    },
  ]);
}
