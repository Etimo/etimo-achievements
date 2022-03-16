import getCurrentCommit from './utils/get-current-commit.js';
import getEnvironment from './utils/get-environment.js';
import getUrl from './utils/get-url.js';
import verifyRelease from './utils/verify-release.js';

const env = getEnvironment(process.argv[2] ?? 'staging');
const apiUrl = getUrl(env, 'api');
const webUrl = getUrl(env, 'web');
const expectedCommit = process.argv[3] ?? getCurrentCommit();

console.log(`Waiting for release (env: ${env}, sha: ${expectedCommit})...`);

verifyRelease(expectedCommit, [apiUrl, webUrl], 900);
