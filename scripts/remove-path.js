import { removePath } from './utils/file-helper.js';

let force = false;
if (process.argv.includes('--force') || process.argv.includes('-f')) {
  force = true;
}

const paths = process.argv.slice(1).filter((a) => !a.startsWith('-'));

for (const path of paths) {
  removePath(path, force);
}
