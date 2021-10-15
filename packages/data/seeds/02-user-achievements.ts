import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('userAchievements').del();

  // Inserts seed entries
  await knex('userAchievements').insert([
    {
      id: '675e7949-6d92-4db8-837b-2266aec83680',
      achievementId: 'b95f4933-fd18-4918-ba8d-dbef8d4895fa',
      userId: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
    },
    {
      id: '74776b4e-4d00-41a5-adba-424fd557fdca',
      achievementId: '774b4b0a-7cb2-4d7f-b9fc-c01c2f14d965',
      userId: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
    },
  ]);
}
