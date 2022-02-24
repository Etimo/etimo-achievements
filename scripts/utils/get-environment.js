export default function getEnvironment(environment) {
  switch (environment.toLowerCase()) {
    case 'staging':
      return 'staging';
    case 'prod':
    case 'production':
      return 'prod';
    default:
      return 'local';
  }
}
