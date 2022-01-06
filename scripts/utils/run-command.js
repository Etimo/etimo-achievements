import * as cp from 'child_process';

export default function runCommand(command, params, cwd) {
  return new Promise((resolve, reject) => {
    const child = cp.spawn(command, params, { cwd, encoding: 'utf8' });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', console.log);
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', console.error);
    child.on('close', (exitCode) => {
      resolve(exitCode === 0);
    });
  });
}
