import installDependencies from './utils/install-dependencies.js';

const wantedDependencies = ['jest', 'knex', 'ts-node', 'typescript:tsc', 'webpack-cli:webpack', 'postcss-cli:postcss'];

installDependencies(wantedDependencies);
