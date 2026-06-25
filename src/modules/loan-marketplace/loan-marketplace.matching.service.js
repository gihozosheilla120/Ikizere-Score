const { LOAN_READINESS_RANK, MATCH_WEIGHTS } = require('./loan-marketplace.constants');

class LoanMarketplaceMatchingService {
  scoreFactor(userScore, minimumScore) {
    if (userScore >= minimumScore) {
      const headroom = Math.max(1, 850 - minimumScore);
      const excess = userScore - minimumScore;
      return 0.7 + 0.3 * Math.min(1, excess / headroom);
    }

    if (minimumScore <= 0) {
      return 1;
    }

    return Math.max(0, (userScore / minimumScore) * 0.6);
  }

  readinessFactor(readinessPercent, minimumPercent) {
    if (readinessPercent >= minimumPercent) {
      return 0.7 + 0.3 * (readinessPercent / 100);
    }

    if (minimumPercent <= 0) {
      return readinessPercent / 100;
    }

    return Math.max(0, (readinessPercent / minimumPercent) * 0.6);
  }

  revenueFactor(monthlyRevenue, minimumRevenue) {
    if (minimumRevenue <= 0) {
      return 1;
    }

    if (monthlyRevenue >= minimumRevenue) {
      return 1;
    }

    return Math.max(0, monthlyRevenue / minimumRevenue);
  }

  calculateMatchPercent(userContext, product) {
    const minReadiness = product.eligibilityRules?.minLoanReadinessPercent ?? 0;

    const scorePart = this.scoreFactor(userContext.currentScore, product.minimumScore);
    const readinessPart = this.readinessFactor(userContext.loanReadinessPercent, minReadiness);
    const revenuePart = this.revenueFactor(userContext.monthlyRevenue, product.minimumRevenue);

    const weighted =
      scorePart * MATCH_WEIGHTS.score +
      readinessPart * MATCH_WEIGHTS.readiness +
      revenuePart * MATCH_WEIGHTS.revenue;

    return Math.round(weighted * 100);
  }

  buildEligibilityReasons(userContext, product, filters = {}) {
    const reasons = [];

    if (userContext.currentScore < product.minimumScore) {
      reasons.push(`Ikizere score ${userContext.currentScore} is below required ${product.minimumScore}`);
    }

    if (userContext.monthlyRevenue < product.minimumRevenue) {
      reasons.push(
        `Monthly revenue ${userContext.monthlyRevenue} is below required ${product.minimumRevenue}`
      );
    }

    const minReadiness = product.eligibilityRules?.minLoanReadinessPercent ?? 0;
    if (userContext.loanReadinessPercent < minReadiness) {
      reasons.push(
        `Loan readiness ${userContext.loanReadinessPercent}% is below required ${minReadiness}%`
      );
    }

    const minRating = product.eligibilityRules?.minLoanReadinessRating;
    if (minRating) {
      const userRank = LOAN_READINESS_RANK[userContext.loanReadinessRating] ?? 0;
      const requiredRank = LOAN_READINESS_RANK[minRating] ?? 0;
      if (userRank < requiredRank) {
        reasons.push(`Loan readiness rating "${userContext.loanReadinessRating}" does not meet "${minRating}"`);
      }
    }

    if (product.eligibilityRules?.requiresVerification && !userContext.verificationApproved) {
      reasons.push('Identity verification is required for this product');
    }

    if (filters.amount != null) {
      if (filters.amount < product.minAmount) {
        reasons.push(`Requested amount is below product minimum of ${product.minAmount}`);
      }
      if (filters.amount > product.maxAmount) {
        reasons.push(`Requested amount exceeds product maximum of ${product.maxAmount}`);
      }
    }

    if (filters.term != null && filters.term !== product.termMonths) {
      reasons.push(`Product term is ${product.termMonths} months, not ${filters.term} months`);
    }

    return reasons;
  }

  isEligible(userContext, product, filters = {}) {
    return this.buildEligibilityReasons(userContext, product, filters).length === 0;
  }

  passesProductFilters(product, filters = {}) {
    if (filters.currency && product.currency !== filters.currency) {
      return false;
    }

    if (filters.amount != null) {
      if (filters.amount < product.minAmount || filters.amount > product.maxAmount) {
        return false;
      }
    }

    if (filters.term != null && filters.term !== product.termMonths) {
      return false;
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      const haystack = `${product.lenderName} ${product.productName} ${product.description}`.toLowerCase();
      if (!haystack.includes(term)) {
        return false;
      }
    }

    return true;
  }

  enrichProduct(product, userContext, filters = {}) {
    const matchPercent = this.calculateMatchPercent(userContext, product);
    const eligibilityReasons = this.buildEligibilityReasons(userContext, product, filters);
    const isEligible = eligibilityReasons.length === 0;

    return {
      id: product._id,
      lenderId: product.lenderId,
      lenderName: product.lenderName,
      productName: product.productName,
      description: product.description,
      minimumScore: product.minimumScore,
      minimumRevenue: product.minimumRevenue,
      interestRate: product.interestRate,
      minAmount: product.minAmount,
      maxAmount: product.maxAmount,
      termMonths: product.termMonths,
      currency: product.currency,
      eligibilityRules: product.eligibilityRules,
      matchPercent,
      isEligible,
      eligibilityReasons,
    };
  }
}

module.exports = new LoanMarketplaceMatchingService();
