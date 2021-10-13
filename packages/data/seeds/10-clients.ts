import { hashPassword } from '@etimo-achievements/security';
import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('clients').del();

  // Inserts seed entries
  await knex('clients').insert([
    {
      id: '946e25b9-6350-40d7-a54f-ebf3e1b5fbd0',
      secret: hashPassword('adminclient123'),
      redirectUris: JSON.stringify(['http://localhost:3000/callback']),
      grants: JSON.stringify(['password', 'refresh_token']),
      userId: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
      createdAt: new Date(2021, 1, 1),
      updatedAt: new Date(2021, 1, 1),
    },
  ]);
}
