import * as cp from 'child_process';

export default function runCommand(command, params, cwd) {
  const child = cp.spawnSync(command, params, { cwd, encoding: 'utf8' });
  if (child.stderr) {
    console.error(child.output.join('\n'));
    return false;
  }

  console.log(child.stdout);
  return true;
}
