import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('badge_awards').insert([
    {
      id: 'e03937d6-da19-4151-bb92-9ca6d674fdbb',
      badge_id: 'c91e35af-ca36-45ea-a75d-c73da0134961',
      user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
      awarded_by_user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
    },
    {
      id: 'c4b18f7c-57d1-437d-bf38-fcc3d378bd60',
      badge_id: 'c91e35af-ca36-45ea-a75d-c73da0134961',
      user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
      awarded_by_user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
    },
  ]);
}
