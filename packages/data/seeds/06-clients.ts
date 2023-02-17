import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('seasons').insert([
    {
      id: '89bbe48f-9465-44fa-822c-b7d927bcd854',
      clientSecret: '$2b$10$UoZV/qxSkEkIb7cKYOCbiuJUDIcpS7s/VhekUtrkcNmreVdby0tpO',
      name: 'A client',
      description: 'A client',
      userId: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
      scope: 'r:awards r:achievements',
    },
    {
      id: 'd7a93903-8fd1-49c7-85cc-0cbe948889d8',
      clientSecret: '$2b$10$UoZV/qxSkEkIb7cKYOCbiuJUDIcpS7s/VhekUtrkcNmreVdby0tpO',
      name: 'A client',
      description: 'A client',
      userId: '537574f5-605d-491e-bd23-108e373aa8ca',
      scope: 'r:awards r:achievements',
    },
  ]);
}
