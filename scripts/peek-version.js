import getApiUrl from './utils/get-api-url.js';
import getEnvironment from './utils/get-environment.js';
import getVersionInfo from './utils/get-version-info.js';

const env = getEnvironment(process.argv[2]);
const url = getApiUrl(env);

getVersionInfo(url).then(data => console.log(`api-${env}: ${data[0].substring(0, 7)} compiled at ${data[1]}`));
