const scoreEngineService = require('../modules/score/score-engine.service');

async function processScoreRecalculation(userId) {
  return scoreEngineService.recalculate(userId);
}

async function processScoreRecalculationJob(job) {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Score recalculation job missing userId');
  }

  return processScoreRecalculation(userId);
}

module.exports = {
  processScoreRecalculation,
  processScoreRecalculationJob,
};
