import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('achievements').del();

  const achievements = [
    {
      id: '44fad392-2016-4916-9fcf-a7680d31c609',
      name: 'My Greatest Achievement',
      description: 'Deltog i Etimo Achievements på Etimo Open',
      achievement_points: 500,
      cooldown_minutes: 60,
      self_awardable: true,
      global_cooldowns: false,
    },
    {
      id: 'ea363ba1-e037-4c3c-a8ed-d393e2539e2f',
      name: 'Coffee Master',
      description: 'Brygga kaffe till kontoret',
      achievement_points: 100,
      cooldown_minutes: 6,
      self_awardable: true,
      global_cooldowns: false,
    },
    {
      id: 'a3b70702-89f7-4687-aa59-65369be45c83',
      name: 'Coffee Master Duo',
      description: 'Brygga två kaffemaskiner samtidigt',
      achievement_points: 250,
      cooldown_minutes: 30,
      self_awardable: true,
      global_cooldowns: true,
    },
    {
      id: 'f95916de-debf-4f8b-8c34-6db21210c71c',
      name: 'Door Clerk',
      description: 'Öppna dörren när det ringer på',
      achievement_points: 30,
      cooldown_minutes: 60,
      self_awardable: true,
      global_cooldowns: true,
    },
    {
      id: 'ff018605-3439-4b4d-9c4e-fb5590799143',
      name: 'Early Bird',
      description: 'Var först in till kontoret (och larmade av)',
      achievement_points: 100,
      cooldown_minutes: 480,
      self_awardable: true,
      global_cooldowns: true,
    },
    {
      id: 'd1254878-2686-4e76-bef8-9c4489b4a2c5',
      name: "I'm Not Your Mama!",
      description: 'Städat upp en kollegas arbetsplats',
      achievement_points: 200,
      cooldown_minutes: 10,
      self_awardable: true,
      global_cooldowns: false,
    },
  ];

  // Inserts seed entries
  await knex('achievements').insert(achievements);
}
