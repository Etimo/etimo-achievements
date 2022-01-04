import * as cp from 'child_process';

export default function getCommandOutput(command, params, cwd) {
  const child = cp.spawnSync(command, params, { cwd, encoding: 'utf8' });
  return [child.status, ...child.output];
}
