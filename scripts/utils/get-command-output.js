import * as cp from 'child_process';

export default function getCommandOutput(command, params, cwd) {
  const child = cp.spawnSync(command, params, { cwd, encoding: 'utf8' });
  if (child.stderr) {
    throw new Error('Error running command: ' + child.stderr);
  }

  return child.output;
}
