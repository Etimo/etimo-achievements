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

Now, you need to build the entire project:

```
yarn docker-rebuild
```

The `docker-rebuild` command will build everything, including dependencies.

It should be used when you add new dependencies to the project.

## Developing

When developing, simply run:

```
yarn start
```

This will start the project in development mode, and `nodemon` will monitor the project and rebuild everything when source files change.
