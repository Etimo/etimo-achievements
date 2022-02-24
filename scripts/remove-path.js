import { removePath } from './utils/file-helper.js';

let recursive = false;
if (process.argv.includes('--recursive')) {
  recursive = true;
}

const paths = process.argv.slice(2).filter((a) => !a.startsWith('-'));

for (const path of paths) {
  removePath(path, recursive);
}
