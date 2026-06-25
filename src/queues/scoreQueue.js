const { Queue } = require('bullmq');
const env = require('../config/env');
const { SCORE_QUEUE_NAME } = require('../modules/score/score.constants');
const { processScoreRecalculationJob } = require('./scoreProcessor');

let queue;

function getRedisConnection() {
  return {
    url: env.redisUrl,
  };
}

function getScoreQueue() {
  if (!queue) {
    queue = new Queue(SCORE_QUEUE_NAME, {
      connection: getRedisConnection(),
    });
  }
  return queue;
}

async function enqueueScoreRecalculation(userId) {
  const userIdStr = userId.toString();

  if (env.isTest) {
    setImmediate(() => {
      processScoreRecalculationJob({ data: { userId: userIdStr } }).catch((error) => {
        console.error('Test score recalculation failed:', error.message);
      });
    });
    return { queued: true, mode: 'test-async' };
  }

  const job = await getScoreQueue().add(
    'recalculate',
    { userId: userIdStr },
    {
      jobId: `score-recalc-${userIdStr}`,
      removeOnComplete: true,
      removeOnFail: 100,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  );

  return { queued: true, jobId: job.id };
}

async function closeScoreQueue() {
  if (queue) {
    await queue.close();
    queue = null;
  }
}

module.exports = {
  getScoreQueue,
  enqueueScoreRecalculation,
  closeScoreQueue,
};
