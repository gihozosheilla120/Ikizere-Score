const ApiError = require('../../utils/ApiError');
const scoreRepository = require('./score.repository');
const { SCORE_WEIGHTS } = require('./score.constants');

class ScoreService {
  async getSummary(userId) {
    const score = await scoreRepository.findScoreByUserId(userId);
    if (!score) {
      throw ApiError.notFound('Score not found for user');
    }

    return {
      currentScore: score.currentScore,
      previousScore: score.previousScore,
      rating: score.rating,
      monthlyChange: score.monthlyChange,
      changeReason: score.changeReason,
      loanReadinessPercent: score.loanReadinessPercent,
      loanReadinessRating: score.loanReadinessRating,
      percentileRank: score.percentileRank,
      lastCalculatedAt: score.lastCalculatedAt,
    };
  }

  async getBreakdown(userId) {
    const score = await scoreRepository.findScoreByUserId(userId);
    if (!score) {
      throw ApiError.notFound('Score not found for user');
    }

    const factors = Object.entries(SCORE_WEIGHTS).map(([key, weight]) => ({
      factor: key,
      weight: Math.round(weight * 100),
      score: score.breakdown?.[key] ?? 0,
      weightedContribution: Math.round((score.breakdown?.[key] ?? 0) * weight),
    }));

    return {
      currentScore: score.currentScore,
      rating: score.rating,
      factors,
      breakdown: score.breakdown,
      lastCalculatedAt: score.lastCalculatedAt,
    };
  }

  async getHistory(userId, query) {
    const result = await scoreRepository.getScoreHistory(userId, query);
    return result;
  }
}

module.exports = new ScoreService();
