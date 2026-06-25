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
    email: `loanapp-${suffix}@example.rw`,
    fullName: 'Loan App User',
    phoneNumber: `+250789${suffix.slice(-6).padStart(6, '0')}`,
    nationalId: `11990901${suffix.slice(-8).padStart(8, '0')}`,
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

async function getStarterProduct() {
  const LoanProduct = require('../../../models/LoanProduct');
  return LoanProduct.findOne({ productName: 'Starter Business Loan' });
}

async function submitStarterApplication(accessToken) {
  const product = await getStarterProduct();
  return request(app)
    .post('/loans/applications')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      loanProductId: product._id.toString(),
      requestedAmount: 100000,
      requestedTermMonths: 6,
      purpose: 'working_capital',
    });
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-minimum';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters-minimum';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('ikizere_loan_apps_test');

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

describe('Loan Applications module', () => {
  test('POST /loans/applications submits application with snapshots', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const res = await submitStarterApplication(accessToken);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.application.status).toBe('submitted');
    expect(res.body.data.application.ikizereScoreSnapshot).toBeGreaterThan(300);
    expect(res.body.data.application.readinessSnapshot).toHaveProperty('percent');
    expect(res.body.data.application.readinessSnapshot).toHaveProperty('rating');
    expect(res.body.data.application.monthlyRevenueSnapshot).toBeGreaterThan(0);
    expect(res.body.data.application.submittedAt).toBeTruthy();

    const AuditLog = require('../../../models/AuditLog');
    const audit = await AuditLog.findOne({
      userId,
      action: 'loan_application_created',
    });
    expect(audit).toBeTruthy();
  });

  test('POST /loans/applications rejects ineligible users', async () => {
    const { accessToken } = await registerUser();

    const res = await submitStarterApplication(accessToken);

    expect(res.statusCode).toBe(403);
  });

  test('POST /loans/applications rejects invalid amount or term', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);
    const product = await getStarterProduct();

    const badAmountRes = await request(app)
      .post('/loans/applications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        loanProductId: product._id.toString(),
        requestedAmount: 10000,
        requestedTermMonths: 6,
        purpose: 'working_capital',
      });

    expect(badAmountRes.statusCode).toBe(400);

    const badTermRes = await request(app)
      .post('/loans/applications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        loanProductId: product._id.toString(),
        requestedAmount: 100000,
        requestedTermMonths: 12,
        purpose: 'working_capital',
      });

    expect(badTermRes.statusCode).toBe(400);
  });

  test('GET /loans/applications lists user applications', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);
    await submitStarterApplication(accessToken);

    const res = await request(app)
      .get('/loans/applications')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.applications.length).toBe(1);
    expect(res.body.meta.total).toBe(1);
  });

  test('GET /loans/applications/:id returns application detail', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const createRes = await request(app)
      .post('/loans/applications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        loanProductId: (await getStarterProduct())._id.toString(),
        requestedAmount: 100000,
        requestedTermMonths: 6,
        purpose: 'equipment',
      });

    const applicationId = createRes.body.data.application.id;

    const res = await request(app)
      .get(`/loans/applications/${applicationId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.application.id).toBe(applicationId);
    expect(res.body.data.application.purpose).toBe('equipment');
  });

  test('GET /loans/applications/:id/timeline returns events', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const createRes = await submitStarterApplication(accessToken);
    const applicationId = createRes.body.data.application.id;

    const res = await request(app)
      .get(`/loans/applications/${applicationId}/timeline`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.timeline.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.timeline.map((e) => e.eventType)).toEqual(
      expect.arrayContaining(['application_created', 'submitted'])
    );

    const LoanApplicationEvent = require('../../../models/LoanApplicationEvent');
    const events = await LoanApplicationEvent.find({ applicationId });
    expect(events.length).toBeGreaterThanOrEqual(2);
  });

  test('PATCH /loans/applications/:id/cancel cancels submitted application', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const createRes = await submitStarterApplication(accessToken);
    const applicationId = createRes.body.data.application.id;

    const res = await request(app)
      .patch(`/loans/applications/${applicationId}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.application.status).toBe('rejected');
    expect(res.body.data.application.rejectionReason).toBe('Cancelled by user');

    const timelineRes = await request(app)
      .get(`/loans/applications/${applicationId}/timeline`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(timelineRes.body.data.timeline.some((e) => e.eventType === 'cancelled')).toBe(true);

    const AuditLog = require('../../../models/AuditLog');
    const audit = await AuditLog.findOne({
      userId,
      action: 'loan_application_cancelled',
    });
    expect(audit).toBeTruthy();
  });

  test('POST /loans/applications returns 409 for duplicate active application', async () => {
    const { accessToken, userId } = await registerUser();
    await setupQualifiedUser(accessToken, userId);

    const first = await submitStarterApplication(accessToken);
    expect(first.statusCode).toBe(201);

    const second = await submitStarterApplication(accessToken);
    expect(second.statusCode).toBe(409);
  });
});
