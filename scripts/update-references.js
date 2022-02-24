import runCommand from './utils/run-command.js';
import updateReferences from './utils/update-references.js';

updateReferences('@etimo-achievements');
runCommand('npm', ['run', 'prettier-configs']);
