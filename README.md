# etimo-achievements

Etimo Achievements is a simple, open-source, web-based platform for managing and sharing achievements.

It is used by [Etimo](https://www.etimo.se) to create, track and hand out achievements on Slack.

## Getting Started

Clone the repository and follow the instructions in this file to get started.

### Dependencies

First off, you need a few global dependencies:

```
sudo npm install -g typescript ts-node rimraf knex lerna
```

Then you need to install the local dependencies:

```
yarn install
```

### First Run

If this is your first time running this project, bootstrap it by running:

```
yarn first-run
```

## Developing

When developing, simply run:

```
yarn start
```

This will start the project in development mode, and `nodemon` will monitor the project and rebuild everything when source files change.

## Database

If you need to recreate, migrate and seed the database, use the following script:

```
yarn db-reset
```

### Migrations

To create a database migration:

```
yarn migration-new <migration name>
```

To apply a database migration:

```
yarn migration-apply
```

To revert a database migration:

```
yarn migration-revert
```

### Seeds

To create a new seed file:

```
yarn seed-new <seed name>
```

To run the seed files:

```
yarn seed-run
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
| [Husky](https://typicode.github.io/husky/)            | Git Hooks.                                                  |
| [Jest](https://jestjs.io/)                            | Unit testing.                                               |
| [Knex](https://knexjs.org)                            | DB access, migrations and seed files.                       |
| [Lerna](https://lerna.js.org/)                        | Manages multiple packages in a monorepo.                    |
| [Nodemon](https://nodemon.io/)                        | Monitoring changes during development.                      |
| [Objection.js](https://vincit.github.io/objection.js) | ORM for Knex.                                               |
| [Postgres](https://www.postgresql.org/)               | SQL database.                                               |
| [Prettier](https://prettier.io)                       | Code formatting.                                            |
| [TypeScript](https://www.typescriptlang.org)          | All source code is written with TypeScript.                 |
| [Yarn](https://yarnpkg.com/)                          | Package manager. Workspaces.                                |
