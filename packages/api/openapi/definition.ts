export const definition = {
  openapi: '3.0.0',
  info: {
    title: 'Etimo Achievements',
    version: '1.0.0',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
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
      url: 'https://etimo-achievements-staging.herokuapp.com',
      description: 'Staging server',
    },
    {
      url: 'https://etimo-achievements.herokuapp.com',
      description: 'Production server',
    },
  ],
  security: [
    {
      ApiKey: [],
    },
  ],
  components: {
    securitySchemes: {
      ApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
};
