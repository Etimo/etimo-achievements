import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('badges').del();

  const badges = [
    {
      id: '99d9505d-0c58-4af8-b069-08732d423e23',
      name: 'False Alarm',
      description: 'Har oavsiktligt utlöst larmet på kontoret 🚨',
    },
    {
      id: 'c91e35af-ca36-45ea-a75d-c73da0134961',
      name: 'Production is Down',
      description: 'Kraschade produktionsmiljön på ett betydande sätt utan att få hjärtattack',
    },
    {
      id: '747d28d3-9739-40a4-bbb9-073dde7965c3',
      name: 'Pyjama Party',
      description: 'Spenderat en natt i kontorets soffa',
    },
  ];

  // Inserts seed entries
  await knex('badges').insert(badges);
}
