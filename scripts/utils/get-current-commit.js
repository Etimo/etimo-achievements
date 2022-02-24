import getCommandOutput from './get-command-output.js';
import { getRootDirectory } from './path-helper.js';

export default function getCurrentCommit() {
  const cwd = getRootDirectory();
  const output = getCommandOutput('git', ['rev-parse', 'HEAD'], cwd);
  const commit = output[2]?.trim('\n');
  return commit;
}
