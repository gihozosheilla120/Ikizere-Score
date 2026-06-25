const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const setupSwagger = require('./config/swagger');
const ApiError = require('./utils/ApiError');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Ikizere Score API is running' });
  });

  app.use(
    '/uploads',
    express.static(path.join(__dirname, '..', 'uploads'), {
      fallthrough: false,
    })
  );

  setupSwagger(app);

  app.use('/auth', routes.auth);
  app.use('/users', routes.users);
  app.use('/verification', routes.verification);
  app.use('/records', routes.records);

  app.use((_req, _res, next) => {
    next(ApiError.notFound('Route not found'));
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
