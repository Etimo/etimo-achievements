import * as cp from 'child_process';

export default function which(command) {
  const child = cp.spawnSync(command, []);
  if (child.stdout) {
    return true;
  }

  return false;
}
