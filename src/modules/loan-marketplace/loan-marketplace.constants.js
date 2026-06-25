const LOAN_READINESS_RANK = Object.freeze({
  not_eligible: 0,
  needs_improvement: 1,
  eligible: 2,
  highly_eligible: 3,
});

const MATCH_WEIGHTS = Object.freeze({
  score: 0.4,
  readiness: 0.35,
  revenue: 0.25,
});

module.exports = {
  LOAN_READINESS_RANK,
  MATCH_WEIGHTS,
};
