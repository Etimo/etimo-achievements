## Getting Started

Clone the repository and follow the instructions in this file to get started.

### First Run

If this is your first time running this project, bootstrap it by running:

```
npm run bootstrap
```

This will install local and global dependencies and create a new database.

## Developing

When developing, simply run:

```
npm run start
```

This will start the project in development mode, and `nodemon` will monitor the project and rebuild everything when source files change.

If you have problems running the project in Docker, you can use the following:

```
npm run start-host
```

This will start the app on the host instead. It will however still run the database inside Docker.

### Extensions

If you want to install the recommended VSCode extensions, simply run:

```
npm run install-extensions
```

## Database

If you need to recreate, migrate and seed the database, use the following script:

```
npm run db-reset
```

If you have recently logged into `pgadmin`, you may need to force reset using the following:

```
npm run db-reset-force
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

## Platforms

Getting this project to start requires installing some dependencies. Check below for help on each platform.

### Mac OS X

#### Git

Install git simply by typing `git` in a Terminal window. If you have it, you will run it. If you don't, OS X will prompt you to install Xcode, which includes git.

#### Homebrew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Nodejs & yarn

```
brew install node@14 yarn
brew link --overwrite node@14
```

#### Docker

```
brew install --cask docker
```
