# etimo-achievements

## Getting Started

First off, you need a few global dependencies:

```
sudo npm install -g typescript ts-node rimraf knex lerna
```

Then you need to install the local dependencies:

```
yarn install
```

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

If you need to recreate, migrate and seed the database, use the following script:

```
yarn db-reset
```
