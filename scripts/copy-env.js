import { copyNoClobber } from './utils/file-helper.js';

const from = process.argv[2];
const to = process.argv[3];

copyNoClobber(from, to);
