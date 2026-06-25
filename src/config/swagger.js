const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ikizere Score API',
      version: '1.0.0',
      description: 'Fintech API for Ikizere Score — credit scoring and loan marketplace',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Local development',
      },
    ],
  },
  apis: ['./src/modules/**/*.swagger.js', './src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Ikizere Score API Docs',
  }));

  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
}

module.exports = setupSwagger;
