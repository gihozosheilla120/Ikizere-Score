const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000);

let mongo;
let app;

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

async function registerUser() {
  const suffix = uniqueSuffix();
  const payload = {
    email: `loans-${suffix}@example.rw`,
    fullName: 'Loan User',
    phoneNumber: `+250788${suffix.slice(-6).padStart(6, '0')}`,
    nationalId: `11990801${suffix.slice(-8).padStart(8, '0')}`,
    businessType: 'retail',
    password: 'password123',
    confirmPassword: 'password123',
    acceptTerms: true,
  };

  const res = await request(app).post('/auth/register').send(payload);
  expect(res.statusCode).toBe(201);

  return {
    accessToken: res.body.data.tokens.accessToken,
    userId: res.body.data.user._id,
  };
}

async function setupQualifiedUser(accessToken, userId) {
  const transactionDate = new Date().toISOString();

  await request(app)
    .post('/records')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      type: 'income',
      category: 'retail_sales',
      amount: 800000,
      currency: 'RWF',
      transactionDate,
      description: 'Monthly sales',
    });

  const Verification = require('../../../models/Verification');
  const { VerificationStatus } = require('../../../constants/enums');
  await Verification.findOneAndUpdate(
    { userId },
    { userId, status: VerificationStatus.APPROVED, nationalIdVerified: true },
    { upsert: true }
  );

  const scoreEngineService = require('../../score/score-engine.service');
  await scoreEngineService.recalculate(userId);
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-minimum';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters-minimum';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('ikizere_loans_test');

  const connectDatabase = require('../../../config/database');
  const createApp = require('../../../app');
  const { seedRecordCategories } = require('../../../seeds/recordCategories.seed');
  const { seedLoanMarketplace } = require('../../../seeds/loanMarketplace.seed');

  await connectDatabase();
  await seedRecordCategories();
  await seedLoanMarketplace();
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

describe('Loan Marketplace module', () => {
  test('GET /loans/marketplace returns seeded products with match data', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const res = await request(app)
      .get('/loans/marketplace')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThanOrEqual(5);
    expect(res.body.data.products[0]).toHaveProperty('lenderName');
    expect(res.body.data.products[0]).toHaveProperty('productName');
    expect(res.body.data.products[0]).toHaveProperty('matchPercent');
    expect(res.body.data.products[0]).toHaveProperty('isEligible');
    expect(res.body.data.userContext).toHaveProperty('currentScore');
    expect(res.body.meta.total).toBe(res.body.data.products.length);
  });

  test('GET /loans/marketplace filters by amount and term', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const res = await request(app)
      .get('/loans/marketplace?amount=100000&term=12&currency=RWF')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    res.body.data.products.forEach((product) => {
      expect(product.minAmount).toBeLessThanOrEqual(100000);
      expect(product.maxAmount).toBeGreaterThanOrEqual(100000);
      expect(product.termMonths).toBe(12);
      expect(product.currency).toBe('RWF');
    });
  });

  test('GET /loans/marketplace/:id returns product with lender details', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const listRes = await request(app)
      .get('/loans/marketplace')
      .set('Authorization', `Bearer ${accessToken}`);

    const productId = listRes.body.data.products[0].id;

    const res = await request(app)
      .get(`/loans/marketplace/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.product.id).toBe(productId);
    expect(res.body.data.product.lender).toHaveProperty('name');
    expect(res.body.data.product).toHaveProperty('eligibilityRules');
    expect(res.body.data.product).toHaveProperty('interestRate');
  });

  test('GET /loans/marketplace/:id returns 404 for unknown product', async () => {
    const { accessToken } = await registerUser();
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/loans/marketplace/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(404);
  });

  test('GET /loans/eligible-products returns only qualifying products', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const res = await request(app)
      .get('/loans/eligible-products?amount=100000&term=6')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    res.body.data.products.forEach((product) => {
      expect(product.isEligible).toBe(true);
      expect(product.eligibilityReasons).toHaveLength(0);
      expect(product.termMonths).toBe(6);
    });
  });

  test('persists user_loan_matches when browsing marketplace', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    await request(app)
      .get('/loans/marketplace')
      .set('Authorization', `Bearer ${accessToken}`);

    const UserLoanMatch = require('../../../models/UserLoanMatch');
    const matches = await UserLoanMatch.find({ userId });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toHaveProperty('matchPercent');
    expect(matches[0]).toHaveProperty('isEligible');
  });

  test('matching service scores low-revenue users lower', async () => {
    const matchingService = require('../loan-marketplace.matching.service');
    const LoanProduct = require('../../../models/LoanProduct');

    const product = await LoanProduct.findOne({ productName: 'Starter Business Loan' });

    const highRevenueContext = {
      currentScore: 600,
      loanReadinessPercent: 75,
      loanReadinessRating: 'eligible',
      monthlyRevenue: 500000,
      verificationApproved: true,
    };

    const lowRevenueContext = {
      ...highRevenueContext,
      monthlyRevenue: 50000,
    };

    const highMatch = matchingService.calculateMatchPercent(highRevenueContext, product);
    const lowMatch = matchingService.calculateMatchPercent(lowRevenueContext, product);

    expect(highMatch).toBeGreaterThan(lowMatch);
  });
});
