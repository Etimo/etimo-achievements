export default function getEnvironment(environment) {
  switch (environment.toLowerCase()) {
    case 'acc':
    case 'acceptance':
      return 'acc';
    case 'prod':
    case 'production':
      return 'prod';
    default:
      return 'local';
  }
}
