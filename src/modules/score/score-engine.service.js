const scoreRepository = require('./score.repository');
const {
  SCORE_WEIGHTS,
  SCORE_MIN,
  SCORE_RANGE,
  RATING_THRESHOLDS,
  LOAN_READINESS_THRESHOLDS,
} = require('./score.constants');
const { RecordType } = require('../../constants/enums');

class ScoreEngineService {
  clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  mean(values) {
    if (!values.length) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  stdDev(values) {
    if (values.length < 2) return 0;
    const avg = this.mean(values);
    const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  resolveRating(score) {
    const match = RATING_THRESHOLDS.find((t) => score >= t.min);
    return match ? match.rating : 'poor';
  }

  resolveLoanReadiness(score) {
    const match = LOAN_READINESS_THRESHOLDS.find((t) => score >= t.min);
    return match || LOAN_READINESS_THRESHOLDS[LOAN_READINESS_THRESHOLDS.length - 1];
  }

  calculateSavingsBehaviour(records) {
    const savings = records.filter((r) => r.type === RecordType.SAVINGS);
    const income = records.filter((r) => r.type === RecordType.INCOME);

    const savingsTotal = savings.reduce((sum, r) => sum + r.amount, 0);
    const incomeTotal = income.reduce((sum, r) => sum + r.amount, 0);

    const savingsRatio = incomeTotal > 0 ? savingsTotal / incomeTotal : 0;
    const frequencyScore = Math.min(50, savings.length * 8);
    const ratioScore = Math.min(50, savingsRatio * 100);

    return this.clamp(frequencyScore + ratioScore);
  }

  calculateIncomeStability(records) {
    const monthlyIncome = records
      .filter((r) => r.type === RecordType.INCOME)
      .reduce((acc, record) => {
        const key = `${record.transactionDate.getUTCFullYear()}-${record.transactionDate.getUTCMonth()}`;
        acc[key] = (acc[key] || 0) + record.amount;
        return acc;
      }, {});

    const values = Object.values(monthlyIncome);
    if (values.length === 0) return 0;

    const avg = this.mean(values);
    if (avg === 0) return 0;

    const cv = this.stdDev(values) / avg;
    return this.clamp(100 - cv * 120);
  }

  calculatePaymentConsistency(records) {
    const expenses = records.filter((r) => r.type === RecordType.EXPENSE);
    const monthsWithExpenses = new Set(
      expenses.map((r) => `${r.transactionDate.getUTCFullYear()}-${r.transactionDate.getUTCMonth()}`)
    ).size;

    const loanInstallments = expenses.filter((r) => r.category === 'loan_installment').length;
    const regularityScore = (monthsWithExpenses / 6) * 60;
    const loanScore = Math.min(25, loanInstallments * 8);
    const volumeScore = Math.min(15, expenses.length * 2);

    return this.clamp(regularityScore + loanScore + volumeScore);
  }

  calculateBusinessActivity(records, businessProfile, verification) {
    let score = Math.min(60, records.length * 3);

    if (scoreRepository.isProfileComplete(businessProfile)) {
      score += 20;
    } else if (businessProfile) {
      score += 10;
    }

    if (scoreRepository.isVerificationApproved(verification)) {
      score += 20;
    } else if (verification?.status === 'pending' || verification?.status === 'under_review') {
      score += 5;
    }

    return this.clamp(score);
  }

  calculateCreditHistory(records, verification) {
    let score = 0;

    if (scoreRepository.isVerificationApproved(verification)) {
      score += 40;
    }

    const loanPayments = records.filter(
      (r) => r.type === RecordType.EXPENSE && r.category === 'loan_installment'
    ).length;
    score += Math.min(40, loanPayments * 10);

    const incomeRecords = records.filter((r) => r.type === RecordType.INCOME).length;
    score += Math.min(20, incomeRecords * 2);

    return this.clamp(score);
  }

  computeWeightedScore(breakdown) {
    const weighted =
      breakdown.savingsBehaviour * SCORE_WEIGHTS.savingsBehaviour +
      breakdown.incomeStability * SCORE_WEIGHTS.incomeStability +
      breakdown.paymentConsistency * SCORE_WEIGHTS.paymentConsistency +
      breakdown.businessActivity * SCORE_WEIGHTS.businessActivity +
      breakdown.creditHistory * SCORE_WEIGHTS.creditHistory;

    return Math.round(SCORE_MIN + (weighted / 100) * SCORE_RANGE);
  }

  deriveChangeReason(breakdown, previousBreakdown) {
    if (!previousBreakdown) {
      return 'Initial score calculated from financial activity';
    }

    const deltas = Object.keys(breakdown).map((key) => ({
      key,
      delta: breakdown[key] - (previousBreakdown[key] || 0),
    }));

    deltas.sort((a, b) => b.delta - a.delta);
    const top = deltas[0];

    if (!top || top.delta <= 0) {
      return 'Score updated based on recent financial activity';
    }

    const labels = {
      savingsBehaviour: 'improved savings behaviour',
      incomeStability: 'more stable income',
      paymentConsistency: 'consistent repayments',
      businessActivity: 'increased business activity',
      creditHistory: 'stronger credit history',
    };

    return `Score improved due to ${labels[top.key] || 'updated financial data'}`;
  }

  async recalculate(userId) {
    const since = new Date();
    since.setMonth(since.getMonth() - 6);

    const [records, businessProfile, verification, existingScore] = await Promise.all([
      scoreRepository.getFinancialRecordsSince(userId, since),
      scoreRepository.getBusinessProfile(userId),
      scoreRepository.getVerification(userId),
      scoreRepository.findScoreByUserId(userId),
    ]);

    const breakdown = {
      savingsBehaviour: this.calculateSavingsBehaviour(records),
      incomeStability: this.calculateIncomeStability(records),
      paymentConsistency: this.calculatePaymentConsistency(records),
      businessActivity: this.calculateBusinessActivity(records, businessProfile, verification),
      creditHistory: this.calculateCreditHistory(records, verification),
    };

    const currentScore = this.computeWeightedScore(breakdown);
    const rating = this.resolveRating(currentScore);
    const loanReadiness = this.resolveLoanReadiness(currentScore);

    const history30d = await scoreRepository.getScoreFromHistoryDaysAgo(userId, 30);
    const monthlyChange = history30d ? currentScore - history30d.score : 0;

    const changeReason = this.deriveChangeReason(breakdown, existingScore?.breakdown?.toObject?.() || existingScore?.breakdown);

    const percentileRank = await scoreRepository.getPercentileRank(userId, currentScore);

    const calculatedAt = new Date();

    const scoreData = {
      currentScore,
      rating,
      monthlyChange,
      changeReason,
      loanReadinessPercent: loanReadiness.percent,
      loanReadinessRating: loanReadiness.rating,
      percentileRank,
      breakdown,
      lastCalculatedAt: calculatedAt,
    };

    const historyEntry = {
      userId,
      score: currentScore,
      rating,
      breakdown,
      calculatedAt,
    };

    return scoreRepository.saveScoreUpdate(userId, scoreData, historyEntry);
  }
}

module.exports = new ScoreEngineService();
