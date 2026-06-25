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
    email: `records-${suffix}@example.rw`,
    fullName: 'Records User',
    phoneNumber: `+250786${suffix.slice(-6).padStart(6, '0')}`,
    nationalId: `11990601${suffix.slice(-8).padStart(8, '0')}`,
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

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-minimum';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters-minimum';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('ikizere_records_test');

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

describe('Financial Records module', () => {
  test('GET /records/categories returns seeded categories', async () => {
    const { accessToken } = await registerUser();

    const res = await request(app)
      .get('/records/categories?type=income')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.categories.length).toBeGreaterThan(0);
    expect(res.body.data.categories[0].type).toBe('income');
  });

  test('CRUD flow with audit logs', async () => {
    const { accessToken, userId } = await registerUser();
    const transactionDate = new Date('2026-06-01T10:00:00.000Z').toISOString();

    const createRes = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'income',
        category: 'retail_sales',
        amount: 50000,
        currency: 'RWF',
        transactionDate,
        description: 'Retail sales today',
        source: 'mobile_money',
        tags: ['shop'],
      });

    expect(createRes.statusCode).toBe(201);
    const recordId = createRes.body.data.record._id;

    const AuditLog = require('../../../models/AuditLog');
    const createLog = await AuditLog.findOne({
      userId,
      action: 'financial_record_created',
    });
    expect(createLog).toBeTruthy();

    const listRes = await request(app)
      .get('/records?type=income&minAmount=1000')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data.records.length).toBe(1);
    expect(listRes.body.meta.total).toBe(1);

    const getRes = await request(app)
      .get(`/records/${recordId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.statusCode).toBe(200);

    const patchRes = await request(app)
      .patch(`/records/${recordId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 75000, description: 'Updated retail sales' });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.data.record.amount).toBe(75000);

    const deleteRes = await request(app)
      .delete(`/records/${recordId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteRes.statusCode).toBe(200);

    const getDeletedRes = await request(app)
      .get(`/records/${recordId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getDeletedRes.statusCode).toBe(404);
  });

  test('GET /records/insights/monthly returns totals', async () => {
    const { accessToken } = await registerUser();
    const transactionDate = new Date('2026-06-15T10:00:00.000Z').toISOString();

    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'income',
        category: 'client_payment',
        amount: 100000,
        currency: 'RWF',
        transactionDate,
        description: 'Client payment',
      });

    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'expense',
        category: 'utilities',
        amount: 20000,
        currency: 'RWF',
        transactionDate,
        description: 'Electricity',
      });

    await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'savings',
        category: 'business_savings',
        amount: 10000,
        currency: 'RWF',
        transactionDate,
        description: 'Monthly savings',
      });

    const insightsRes = await request(app)
      .get('/records/insights/monthly?year=2026&month=6&currency=RWF')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(insightsRes.statusCode).toBe(200);
    expect(insightsRes.body.data.totalIncome).toBe(100000);
    expect(insightsRes.body.data.totalExpenses).toBe(20000);
    expect(insightsRes.body.data.totalSavings).toBe(10000);
    expect(insightsRes.body.data.netCashFlow).toBe(80000);
  });

  test('rejects invalid category for type', async () => {
    const { accessToken } = await registerUser();

    const res = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'income',
        category: 'utilities',
        amount: 1000,
        currency: 'RWF',
        transactionDate: new Date().toISOString(),
      });

    expect(res.statusCode).toBe(400);
  });
});
