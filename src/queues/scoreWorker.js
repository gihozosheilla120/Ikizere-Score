const { Worker } = require('bullmq');
const env = require('../config/env');
const connectDatabase = require('../config/database');
const { SCORE_QUEUE_NAME } = require('../modules/score/score.constants');
const { processScoreRecalculationJob } = require('./scoreProcessor');

let worker;

async function startScoreWorker() {
  if (env.isTest) {
    return null;
  }

  await connectDatabase();

  worker = new Worker(SCORE_QUEUE_NAME, processScoreRecalculationJob, {
    connection: { url: env.redisUrl },
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    console.log(`Score recalculation completed for user ${job.data.userId}`);
  });

  worker.on('failed', (job, error) => {
    console.error(`Score recalculation failed for user ${job?.data?.userId}:`, error.message);
  });

  console.log('Score worker started');
  return worker;
}

async function stopScoreWorker() {
  if (worker) {
    await worker.close();
    worker = null;
  }
}

if (require.main === module) {
  startScoreWorker().catch((error) => {
    console.error('Failed to start score worker:', error);
    process.exit(1);
  });
}

module.exports = {
  startScoreWorker,
  stopScoreWorker,
};
