import * as fs from 'fs';
import * as path from 'path';
import { getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

const bin = process.argv[2];
const params = process.argv.slice(3);
const cwd = process.cwd();
const rootDir = getRootDirectory();

let binPath = path.join(rootDir, 'node_modules', '.bin', bin);
if (!fs.existsSync(binPath) && rootDir !== cwd) {
  binPath = path.join(cwd, 'node_modules', '.bin', bin);
}

if (!fs.existsSync(binPath)) {
  console.error(`Could not find bin file ${bin}`);
  process.exit(1);
}

runCommand(binPath, params, cwd);
