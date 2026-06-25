const createApp = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');
const { seedRecordCategories } = require('./seeds/recordCategories.seed');

async function startServer() {
  await connectDatabase();
  await seedRecordCategories();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
    console.log(`Swagger docs: http://localhost:${env.port}/api-docs`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
