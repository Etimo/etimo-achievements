export default function getApiUrl(environment) {
  switch (environment) {
    case 'acc':
      return 'https://etimo-achievements-staging.herokuapp.com';
    case 'prod':
      return 'https://etimo-achievements.herokuapp.com';
    case 'local':
      return 'http://localhost:3000';
    default:
      throw new Error(`Invalid environment: ${environment}`);
  }
}
