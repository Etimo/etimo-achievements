import getApiUrl from './utils/get-api-url.js';
import getEnvironment from './utils/get-environment.js';
import getVersionInfo from './utils/get-version-info.js';

const env = getEnvironment(process.argv[2]);
const url = getApiUrl(env);
console.log(`Fetching version information for ${env} from ${url}`);

getVersionInfo(url).then(data => console.log(data));
