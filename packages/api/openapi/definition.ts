const baseUrl = process.env.API_BASEURL;

export const definition = {
  openapi: '3.0.0',
  info: {
    title: 'Etimo Achievements',
    version: '1.0.0',
    license: {
      name: 'Swagger spec',
      url: '/swagger.json',
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
      url: 'https://etimo-achievements.herokuapp.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'ea-jwt',
      },
      ApiKeyParameter: {
        type: 'apiKey',
        in: 'query',
        name: 'apiKey',
      },
    },
  },
};
