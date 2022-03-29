export default function getUrl(environment, app) {
  switch (app) {
    case 'api':
      return getApiUrl(environment);

    case 'web':
      return getWebUrl(environment);

    default:
      throw new Error(`Invalid app: ${app}`);
  }
}

function getApiUrl(environment) {
  switch (environment) {
    case 'staging':
      return 'https://achievements-test.staging.etimo-test.live/api';
    case 'prod':
      return 'https://achievements-live.staging.etimo-test.live/api';
    case 'local':
      return 'http://localhost:3000';
    default:
      throw new Error(`Invalid environment: ${environment}`);
  }
}

function getWebUrl(environment) {
  switch (environment) {
    case 'staging':
      return 'https://achievements-test.staging.etimo-test.live';
    case 'prod':
      return 'https://achievements-live.staging.etimo-test.live';
    case 'local':
      return 'http://localhost:3001';
    default:
      throw new Error(`Invalid environment: ${environment}`);
  }
}
