import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('achievements').del();

  // Inserts seed entries
  await knex('achievements').insert([
    {
      id: 'b95f4933-fd18-4918-ba8d-dbef8d4895fa',
      achievement: 'rickard',
      description: 'Bästa namnet på kontoret.',
    },
    {
      id: '774b4b0a-7cb2-4d7f-b9fc-c01c2f14d965',
      achievement: 'zsh',
      description: 'Bästa terminalemulatorn.',
    },
  ]);
}
