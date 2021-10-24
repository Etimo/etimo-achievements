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
