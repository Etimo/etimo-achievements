import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('badges').del();

  const badges = [
    {
      id: '99d9505d-0c58-4af8-b069-08732d423e23',
      name: 'Åre 2022',
      description: 'Var med på Åreresan 2022',
    },
    {
      id: 'c91e35af-ca36-45ea-a75d-c73da0134961',
      name: 'Kaffemotståndare',
      description: 'Var en person som inte dricker kaffe',
    },
  ];

  // Inserts seed entries
  await knex('badges').insert(badges);
}
