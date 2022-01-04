import runScript from './utils/run-script.js';

const script = process.argv[2];
const params = process.argv.slice(3);
runScript(script, params);
