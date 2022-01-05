import getApiUrl from './utils/get-api-url.js';
import getCurrentCommit from './utils/get-current-commit.js';
import getEnvironment from './utils/get-environment.js';
import verifyRelease from './utils/verify-release.js';

const env = getEnvironment(process.argv[2] ?? 'staging');
const apiUrl = getApiUrl(env);
const expectedCommit = process.argv[3] ?? getCurrentCommit();

console.log(`Waiting for release (env: ${env}, sha: ${expectedCommit})...`);

verifyRelease(expectedCommit, [apiUrl], 900);
