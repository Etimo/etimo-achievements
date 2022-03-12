import installDependencies from './utils/install-dependencies.js';

const wantedDependencies = ['jest', 'knex', 'ts-node', 'typescript:tsc', 'react-scripts'];

installDependencies(wantedDependencies);
