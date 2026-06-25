const ApiError = require('../../utils/ApiError');
const loanMarketplaceRepository = require('./loan-marketplace.repository');
const matchingService = require('./loan-marketplace.matching.service');

class LoanMarketplaceService {
  async buildUserContext(userId, currency = null) {
    const [score, verification, monthlyRevenue] = await Promise.all([
      loanMarketplaceRepository.findScoreByUserId(userId),
      loanMarketplaceRepository.findVerificationByUserId(userId),
      loanMarketplaceRepository.getMonthlyRevenue(userId, currency),
    ]);

    return {
      currentScore: score?.currentScore ?? 300,
      loanReadinessPercent: score?.loanReadinessPercent ?? 0,
      loanReadinessRating: score?.loanReadinessRating ?? 'not_eligible',
      monthlyRevenue,
      verificationApproved: loanMarketplaceRepository.isVerificationApproved(verification),
    };
  }

  async getMarketplace(userId, filters = {}) {
    const [products, userContext] = await Promise.all([
      loanMarketplaceRepository.findActiveProducts(),
      this.buildUserContext(userId, filters.currency),
    ]);

    const filtered = products.filter((product) => matchingService.passesProductFilters(product, filters));

    const enriched = filtered.map((product) => matchingService.enrichProduct(product, userContext, filters));

    await loanMarketplaceRepository.upsertUserMatches(
      userId,
      enriched.map((product) => ({
        productId: product.id,
        matchPercent: product.matchPercent,
        isEligible: product.isEligible,
        eligibilityReasons: product.eligibilityReasons,
      }))
    );

    enriched.sort((a, b) => b.matchPercent - a.matchPercent);

    return {
      products: enriched,
      userContext: {
        currentScore: userContext.currentScore,
        loanReadinessPercent: userContext.loanReadinessPercent,
        loanReadinessRating: userContext.loanReadinessRating,
        monthlyRevenue: userContext.monthlyRevenue,
      },
    };
  }

  async getProductById(userId, productId, filters = {}) {
    const product = await loanMarketplaceRepository.findProductById(productId);
    if (!product) {
      throw ApiError.notFound('Loan product not found');
    }

    const [userContext, lender] = await Promise.all([
      this.buildUserContext(userId, product.currency),
      loanMarketplaceRepository.findLenderById(product.lenderId),
    ]);

    const enriched = matchingService.enrichProduct(product, userContext, filters);

    await loanMarketplaceRepository.upsertUserMatches(userId, [
      {
        productId: product._id,
        matchPercent: enriched.matchPercent,
        isEligible: enriched.isEligible,
        eligibilityReasons: enriched.eligibilityReasons,
      },
    ]);

    return {
      ...enriched,
      lender: lender
        ? {
            id: lender._id,
            name: lender.name,
            logoUrl: lender.logoUrl,
            verified: lender.verified,
            description: lender.description,
          }
        : null,
    };
  }

  async getEligibleProducts(userId, filters = {}) {
    const result = await this.getMarketplace(userId, filters);
    const eligibleProducts = result.products.filter((product) => product.isEligible);

    return {
      products: eligibleProducts,
      userContext: result.userContext,
    };
  }
}

module.exports = new LoanMarketplaceService();
