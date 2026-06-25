const SCORE_WEIGHTS = Object.freeze({
  savingsBehaviour: 0.25,
  incomeStability: 0.2,
  paymentConsistency: 0.3,
  businessActivity: 0.15,
  creditHistory: 0.1,
});

const SCORE_MIN = 300;
const SCORE_MAX = 850;
const SCORE_RANGE = SCORE_MAX - SCORE_MIN;

const RATING_THRESHOLDS = Object.freeze([
  { min: 700, rating: 'excellent' },
  { min: 550, rating: 'good' },
  { min: 400, rating: 'fair' },
  { min: 300, rating: 'poor' },
]);

const LOAN_READINESS_THRESHOLDS = Object.freeze([
  { min: 700, rating: 'highly_eligible', percent: 90 },
  { min: 550, rating: 'eligible', percent: 75 },
  { min: 400, rating: 'needs_improvement', percent: 50 },
  { min: 300, rating: 'not_eligible', percent: 25 },
]);

const SCORE_QUEUE_NAME = 'score-recalculation';

module.exports = {
  SCORE_WEIGHTS,
  SCORE_MIN,
  SCORE_MAX,
  SCORE_RANGE,
  RATING_THRESHOLDS,
  LOAN_READINESS_THRESHOLDS,
  SCORE_QUEUE_NAME,
};
