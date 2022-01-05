import * as cp from 'child_process';

export default function which(command) {
  let child;
  if (process.platform === 'win32') {
    child = cp.spawnSync('Get-Command', [command], { shell: 'powershell.exe' });
  }
  else {
    child = cp.spawnSync('which', [command]);
  }
  return child.status === 0;
}
