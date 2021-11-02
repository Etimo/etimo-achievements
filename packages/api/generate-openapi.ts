import fs from 'fs';
import SwaggerJSDoc from 'swagger-jsdoc';
import { definition } from './openapi/definition';

const options = {
  apis: [`${__dirname}/src/resources/**/*.ts`, `${__dirname}/openapi/**/*.yml`],
  definition,
};

const runtime = () => {
  try {
    const openApiSpecification = SwaggerJSDoc(options);
    fs.writeFileSync(`${__dirname}/src/openapi.json`, JSON.stringify(openApiSpecification, null, 2));
  } catch (e) {
    console.log('broke', e);
  }
};

runtime();
