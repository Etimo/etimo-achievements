import { loadFileAsObject } from './utils/file-helper.js';
import { getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';

async function installVscodeExtensions() {
  const extensions = loadFileAsObject('.vscode/extensions.json');
  const cwd = getRootDirectory();
  for (const extension of extensions.recommendations) {
    const success = await runCommand('code', ['--install-extension', extension], cwd);
    if (!success) {
      process.exit(1);
    }
  }
}

installVscodeExtensions();
