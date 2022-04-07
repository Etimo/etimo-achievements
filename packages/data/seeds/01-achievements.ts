import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('achievements').del();

  const achievements = [
    {
      id: 'b95f4933-fd18-4918-ba8d-dbef8d4895fa',
      name: 'rickard',
      description: 'Bästa namnet på kontoret.',
      achievement_points: 540000,
      cooldown_minutes: 6,
    },
    {
      id: '774b4b0a-7cb2-4d7f-b9fc-c01c2f14d965',
      name: 'zsh',
      description: 'Bästa terminalemulatorn.',
      achievement_points: 55,
      cooldown_minutes: 60,
    },
  ];

  // Inserts seed entries
  await knex('achievements').insert(achievements);
}
