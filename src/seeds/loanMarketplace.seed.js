const Lender = require('../models/Lender');
const LoanProduct = require('../models/LoanProduct');

const lendersSeed = [
  {
    name: 'Equity Apex Bank',
    logoUrl: null,
    description: 'Leading commercial bank for SME lending in Rwanda.',
    verified: true,
  },
  {
    name: 'Kigali Growth Finance',
    logoUrl: null,
    description: 'Fast-approval micro and small business loans.',
    verified: true,
  },
  {
    name: 'Umoja Credit Union',
    logoUrl: null,
    description: 'Member-owned cooperative lending for local businesses.',
    verified: true,
  },
];

const productsSeed = [
  {
    productName: 'SME Working Capital',
    description: 'Flexible working capital for established retailers and service businesses.',
    minimumScore: 550,
    minimumRevenue: 500000,
    interestRate: 14.5,
    minAmount: 100000,
    maxAmount: 3000000,
    termMonths: 12,
    currency: 'RWF',
    eligibilityRules: {
      minLoanReadinessPercent: 75,
      requiresVerification: true,
      minLoanReadinessRating: 'eligible',
    },
  },
  {
    productName: 'Starter Business Loan',
    description: 'Entry-level loan for new businesses building credit history.',
    minimumScore: 400,
    minimumRevenue: 200000,
    interestRate: 18,
    minAmount: 50000,
    maxAmount: 1000000,
    termMonths: 6,
    currency: 'RWF',
    eligibilityRules: {
      minLoanReadinessPercent: 50,
      requiresVerification: false,
    },
  },
  {
    productName: 'Growth Expansion Loan',
    description: 'Higher-limit financing for verified businesses ready to scale.',
    minimumScore: 650,
    minimumRevenue: 1000000,
    interestRate: 12,
    minAmount: 500000,
    maxAmount: 5000000,
    termMonths: 24,
    currency: 'RWF',
    eligibilityRules: {
      minLoanReadinessPercent: 90,
      requiresVerification: true,
      minLoanReadinessRating: 'highly_eligible',
    },
  },
  {
    productName: 'Quick Cash Advance',
    description: 'Short-term liquidity with fast disbursement.',
    minimumScore: 450,
    minimumRevenue: 300000,
    interestRate: 16,
    minAmount: 75000,
    maxAmount: 1500000,
    termMonths: 3,
    currency: 'RWF',
    eligibilityRules: {
      minLoanReadinessPercent: 50,
      requiresVerification: false,
    },
  },
  {
    productName: 'Agri Seasonal Loan',
    description: 'Seasonal financing for agriculture and agro-processing.',
    minimumScore: 500,
    minimumRevenue: 400000,
    interestRate: 13.5,
    minAmount: 200000,
    maxAmount: 2500000,
    termMonths: 18,
    currency: 'RWF',
    eligibilityRules: {
      minLoanReadinessPercent: 60,
      requiresVerification: true,
    },
  },
];

async function seedLoanMarketplace() {
  const existingCount = await LoanProduct.countDocuments();
  if (existingCount > 0) {
    return { seeded: false, count: existingCount };
  }

  const lenders = await Lender.insertMany(lendersSeed);

  const products = productsSeed.map((product, index) => ({
    ...product,
    lenderId: lenders[index % lenders.length]._id,
    lenderName: lenders[index % lenders.length].name,
    isActive: true,
  }));

  await LoanProduct.insertMany(products);

  return { seeded: true, lenders: lenders.length, products: products.length };
}

module.exports = {
  seedLoanMarketplace,
  lendersSeed,
  productsSeed,
};
