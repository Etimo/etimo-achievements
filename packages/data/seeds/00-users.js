"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const security_1 = require("@etimo-achievements/security");
async function seed(knex) {
    // Deletes ALL existing entries
    await knex('users').del();
    // Inserts seed entries
    await knex('users').insert([
        {
            id: 'ce76945f-b41e-4b3b-b2a9-6774c2201556',
            username: 'admin',
            password: (0, security_1.hashPassword)('admin123'),
            email: 'admin@etimo.se',
            slackHandle: '@admin',
        },
        {
            id: 'b158d926-9ef6-42a5-9059-f810a6d1c980',
            username: 'user',
            password: (0, security_1.hashPassword)('test123'),
            email: 'user@etimo.se',
            slackHandle: '@user',
        },
    ]);
}
exports.seed = seed;
//# sourceMappingURL=00-users.js.map