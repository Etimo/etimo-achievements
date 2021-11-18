# etimo-achievements

Etimo Achievements is a simple, open-source, web-based platform for managing and sharing achievements.

It is used by [Etimo](https://www.etimo.se) to create, track and hand out achievements on Slack.

## Getting Started

Clone the repository and follow the instructions in this file to get started.

### First Run

If this is your first time running this project, bootstrap it by running:

```
npm run first-run
```

This will install local and global dependencies and create a new database.

## Developing

When developing, simply run:

```
npm run start
```

This will start the project in development mode, and `nodemon` will monitor the project and rebuild everything when source files change.

## Database

If you need to recreate, migrate and seed the database, use the following script:

```
npm run db-reset
```

### Migrations

To create a database migration:

```
npm run migration-new <migration name>
```

To apply a database migration:

```
npm run migration-apply
```

To revert a database migration:

```
npm run migration-revert
```

### Seeds

To create a new seed file:

```
npm run seed-new <seed name>
```

To run the seed files:

```
npm run seed-run
```

## Technologies

These are the technologies used in this project:

| Technology                                            | Description                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| [Docker](https://www.docker.com/)                     | Containers are used in local development and in production. |
| [ESLint](https://eslint.org/)                         | Code linting.                                               |
| [GNU Bash](https://www.gnu.org/software/bash/)        | Deployment/utility scripts.                                 |
| [GitHub Actions](https://github.com/features/actions) | Continuous integration/deployment.                          |
| [Heroku](https://www.heroku.com/)                     | Cloud platform for deployment.                              |
| [Husky](https://typicode.github.io/husky/)            | Git hooks.                                                  |
| [Jest](https://jestjs.io/)                            | Unit testing.                                               |
| [Knex](https://knexjs.org)                            | DB access, migrations and seed files.                       |
| [Nodemon](https://nodemon.io/)                        | Change monitoring during development.                       |
| [Objection.js](https://vincit.github.io/objection.js) | ORM for Knex.                                               |
| [Postgres](https://www.postgresql.org/)               | SQL database.                                               |
| [Prettier](https://prettier.io)                       | Code formatting.                                            |
| [Swagger](https://swagger.io/)                        | API documentation.                                          |
| [TypeScript](https://www.typescriptlang.org)          | Strong typing.                                              |
| [Yarn](https://yarnpkg.com/)                          | Package manager & workspaces.                               |
