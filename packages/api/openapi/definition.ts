export const definition = {
  openapi: '3.0.0',
  info: {
    title: 'Etimo Achievements',
    version: '1.0.0',
    license: {
      name: 'Swagger spec',
      url: 'openapi.json',
    },
    contact: {
      name: 'Etimo AB',
      url: 'https://etimo.se',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'http://45.77.89.90:4000',
      description: 'Etimo server',
    },
    {
      url: 'https://achievements-test.staging.etimo-test.live/api',
      description: 'Staging server',
    },
    {
      url: 'https://achievements-live.staging.etimo-test.live/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      jwtCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'ea-jwt',
      },
      refreshTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'ea-rt',
      },
      ApiKeyParameter: {
        type: 'apiKey',
        in: 'query',
        name: 'apiKey',
      },
    },
  },
};
