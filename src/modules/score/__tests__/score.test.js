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
    email: `score-${suffix}@example.rw`,
    fullName: 'Score User',
    phoneNumber: `+250787${suffix.slice(-6).padStart(6, '0')}`,
    nationalId: `11990701${suffix.slice(-8).padStart(8, '0')}`,
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

async function waitForScoreUpdate(userId, timeoutMs = 5000) {
  const Score = require('../../../models/Score');
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const score = await Score.findOne({ userId });
    if (score?.lastCalculatedAt) {
      return score;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error('Timed out waiting for score recalculation');
}

async function seedFinancialActivity(accessToken) {
  const transactionDate = new Date().toISOString();

  const records = [
    {
      type: 'income',
      category: 'retail_sales',
      amount: 200000,
      currency: 'RWF',
      transactionDate,
      description: 'Retail sales',
    },
    {
      type: 'income',
      category: 'client_payment',
      amount: 150000,
      currency: 'RWF',
      transactionDate,
      description: 'Client payment',
    },
    {
      type: 'expense',
      category: 'utilities',
      amount: 30000,
      currency: 'RWF',
      transactionDate,
      description: 'Utilities',
    },
    {
      type: 'expense',
      category: 'loan_installment',
      amount: 50000,
      currency: 'RWF',
      transactionDate,
      description: 'Loan repayment',
    },
    {
      type: 'savings',
      category: 'business_savings',
      amount: 40000,
      currency: 'RWF',
      transactionDate,
      description: 'Monthly savings',
    },
  ];

  for (const record of records) {
    const res = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(record);
    expect(res.statusCode).toBe(201);
  }
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-minimum';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters-minimum';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('ikizere_score_test');

  const connectDatabase = require('../../../config/database');
  const createApp = require('../../../app');
  const { seedRecordCategories } = require('../../../seeds/recordCategories.seed');

  await connectDatabase();
  await seedRecordCategories();
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

describe('Score module', () => {
  test('recalculates score from financial records, profile, and verification', async () => {
    const { accessToken, userId } = await registerUser();
    await seedFinancialActivity(accessToken);

    const BusinessProfile = require('../../../models/BusinessProfile');
    const Verification = require('../../../models/Verification');
    const { BusinessProfileStatus, VerificationStatus } = require('../../../constants/enums');

    await BusinessProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        businessName: 'Ikizere Shop',
        industry: 'retail',
        status: BusinessProfileStatus.COMPLETED,
        completedAt: new Date(),
      },
      { upsert: true }
    );

    await Verification.findOneAndUpdate(
      { userId },
      {
        userId,
        status: VerificationStatus.APPROVED,
        nationalIdVerified: true,
      },
      { upsert: true }
    );

    const scoreEngineService = require('../score-engine.service');
    const updated = await scoreEngineService.recalculate(userId);

    expect(updated.currentScore).toBeGreaterThanOrEqual(300);
    expect(updated.currentScore).toBeLessThanOrEqual(850);
    expect(updated.rating).toBeTruthy();
    expect(updated.breakdown.savingsBehaviour).toBeGreaterThan(0);
    expect(updated.breakdown.incomeStability).toBeGreaterThan(0);
    expect(updated.breakdown.paymentConsistency).toBeGreaterThan(0);
    expect(updated.breakdown.businessActivity).toBeGreaterThan(0);
    expect(updated.breakdown.creditHistory).toBeGreaterThan(0);
    expect(updated.lastCalculatedAt).toBeTruthy();

    const ScoreHistory = require('../../../models/ScoreHistory');
    const historyCount = await ScoreHistory.countDocuments({ userId });
    expect(historyCount).toBeGreaterThanOrEqual(1);
  });

  test('GET /score/summary returns score snapshot', async () => {
    const { accessToken, userId } = await registerUser();
    await seedFinancialActivity(accessToken);

    const scoreEngineService = require('../score-engine.service');
    await scoreEngineService.recalculate(userId);

    const res = await request(app)
      .get('/score/summary')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.currentScore).toBeGreaterThanOrEqual(300);
    expect(res.body.data.rating).toBeTruthy();
    expect(res.body.data).toHaveProperty('monthlyChange');
    expect(res.body.data).toHaveProperty('loanReadinessPercent');
    expect(res.body.data.lastCalculatedAt).toBeTruthy();
  });

  test('GET /score/breakdown returns weighted factors', async () => {
    const { accessToken, userId } = await registerUser();
    await seedFinancialActivity(accessToken);

    const scoreEngineService = require('../score-engine.service');
    await scoreEngineService.recalculate(userId);

    const res = await request(app)
      .get('/score/breakdown')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.factors).toHaveLength(5);
    expect(res.body.data.factors.map((f) => f.factor)).toEqual(
      expect.arrayContaining([
        'savingsBehaviour',
        'incomeStability',
        'paymentConsistency',
        'businessActivity',
        'creditHistory',
      ])
    );

    const weightSum = res.body.data.factors.reduce((sum, f) => sum + f.weight, 0);
    expect(weightSum).toBe(100);
  });

  test('GET /score/history returns paginated history', async () => {
    const { accessToken, userId } = await registerUser();
    await seedFinancialActivity(accessToken);

    const scoreEngineService = require('../score-engine.service');
    await scoreEngineService.recalculate(userId);
    await scoreEngineService.recalculate(userId);

    const res = await request(app)
      .get('/score/history?limit=10&page=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.history.length).toBeGreaterThanOrEqual(2);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    expect(res.body.data.history[0]).toHaveProperty('score');
    expect(res.body.data.history[0]).toHaveProperty('breakdown');
  });

  test('financial record changes enqueue background score recalculation', async () => {
    const { accessToken, userId } = await registerUser();

    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'income',
        category: 'retail_sales',
        amount: 100000,
        currency: 'RWF',
        transactionDate: new Date().toISOString(),
        description: 'Sales',
      });

    const score = await waitForScoreUpdate(userId);
    expect(score.currentScore).toBeGreaterThan(300);
    expect(score.lastCalculatedAt).toBeTruthy();
  });
});
