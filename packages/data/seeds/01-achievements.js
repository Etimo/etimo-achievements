"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
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
exports.seed = seed;
//# sourceMappingURL=01-achievements.js.map