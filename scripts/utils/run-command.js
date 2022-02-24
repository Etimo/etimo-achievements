import * as cp from 'child_process';
import { platform } from 'os';

export default function runCommand(command, params, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawnProcess(command, params, cwd);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', console.log);
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', console.error);
    child.on('close', (exitCode) => {
      resolve(exitCode === 0);
    });
  });
}

function spawnProcess(command, params, cwd) {
  if (process.platform == 'win32') {
    return cp.spawn('cmd.exe', ['/c', command, ...params], { cwd, encoding: 'utf8' });
  }
  return cp.spawn(command, params, { cwd, encoding: 'utf8' });
}
