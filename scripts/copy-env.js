import { copy, copyNoClobber } from './utils/file-helper.js';

const paths = [
  ['packages/api/.env.defaults', 'packages/api/.env'],
  ['packages/web/.env.defaults', 'packages/web/.env'],
  ['packages/worker/.env.defaults', 'packages/worker/.env'],
];

if (process.argv.includes('--force')) {
  copyFiles(copy);
} else {
  copyFiles(copyNoClobber);
}

function copyFiles(copyFn) {
  for (const path of paths) {
    copyFn(path[0], path[1]);
  }
}
