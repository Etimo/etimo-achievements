import getEnvironment from './utils/get-environment.js';
import getUrl from './utils/get-api-url.js';
import getVersionInfo from './utils/get-version-info.js';

const env = getEnvironment(process.argv[2] ?? 'staging');
const apiUrl = getUrl(env, 'api');
const webUrl = getUrl(env, 'web');

getVersionInfo(apiUrl).then((data) => console.log(`api-${env}: ${data[0].substring(0, 7)} compiled at ${data[1]}`));
getVersionInfo(webUrl).then((data) => console.log(`api-${env}: ${data[0].substring(0, 7)} compiled at ${data[1]}`));
