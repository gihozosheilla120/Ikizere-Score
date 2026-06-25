const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000);

let mongo;
let app;

function tinyPngBuffer() {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/er2S2sAAAAASUVORK5CYII=',
    'base64'
  );
}

function tinyPdfBuffer() {
  return Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n', 'utf8');
}

function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

async function registerUser() {
  const suffix = uniqueSuffix();
  const payload = {
    email: `verifier-${suffix}@example.rw`,
    fullName: 'Verifier User',
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

async function promoteToAdmin(userId) {
  const User = require('../../../models/User');
  const { UserRole } = require('../../../constants/enums');
  await User.findByIdAndUpdate(userId, { role: UserRole.ADMIN });
}

async function loginAsAdmin() {
  const suffix = uniqueSuffix();
  const email = `admin-${suffix}@example.rw`;
  const payload = {
    email,
    fullName: 'Admin User',
    phoneNumber: `+250787${suffix.slice(-6).padStart(6, '0')}`,
    nationalId: `11990701${suffix.slice(-8).padStart(8, '0')}`,
    businessType: 'retail',
    password: 'password123',
    confirmPassword: 'password123',
    acceptTerms: true,
  };

  const res = await request(app).post('/auth/register').send(payload);
  await promoteToAdmin(res.body.data.user._id);

  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password: 'password123' });

  return {
    accessToken: loginRes.body.data.tokens.accessToken,
    userId: res.body.data.user._id,
  };
}

async function uploadAndSubmit(accessToken) {
  const uploadRes = await request(app)
    .post('/verification/upload')
    .set('Authorization', `Bearer ${accessToken}`)
    .attach('nationalIdFront', tinyPngBuffer(), { filename: 'id-front.png', contentType: 'image/png' })
    .attach('nationalIdBack', tinyPngBuffer(), { filename: 'id-back.png', contentType: 'image/png' })
    .attach('businessRegistrationCertificate', tinyPdfBuffer(), {
      filename: 'brc.pdf',
      contentType: 'application/pdf',
    })
    .attach('taxCertificate', tinyPdfBuffer(), { filename: 'tax.pdf', contentType: 'application/pdf' });

  expect(uploadRes.statusCode).toBe(200);

  const submitRes = await request(app)
    .post('/verification/submit')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(uploadRes.body.data);

  expect(submitRes.statusCode).toBe(201);
  return submitRes.body.data.verification;
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-minimum';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-32-characters-minimum';
  process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('ikizere_test');

  const connectDatabase = require('../../../config/database');
  const createApp = require('../../../app');

  await connectDatabase();
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

describe('Verification module', () => {
  test('upload -> submit -> status/details', async () => {
    const { accessToken } = await registerUser();
    await uploadAndSubmit(accessToken);

    const statusRes = await request(app)
      .get('/verification/status')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.data.status).toBe('pending');

    const detailsRes = await request(app)
      .get('/verification/details')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(detailsRes.statusCode).toBe(200);
    expect(detailsRes.body.data.verification.idFrontUrl).toBeDefined();
  });

  describe('Admin verification endpoints', () => {
    test('non-admin cannot approve verification', async () => {
      const { accessToken, userId } = await registerUser();
      await uploadAndSubmit(accessToken);

      const res = await request(app)
        .post(`/verification/admin/${userId}/approve`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/admin/i);
    });

    test('admin can approve verification and update user fields', async () => {
      const { accessToken, userId } = await registerUser();
      await uploadAndSubmit(accessToken);
      const admin = await loginAsAdmin();

      const approveRes = await request(app)
        .post(`/verification/admin/${userId}/approve`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      expect(approveRes.statusCode).toBe(200);
      expect(approveRes.body.data.verification.status).toBe('approved');

      const User = require('../../../models/User');
      const AuditLog = require('../../../models/AuditLog');
      const user = await User.findById(userId);

      expect(user.nationalIdVerified).toBe(true);
      expect(user.accountStatus).toBe('verified');
      expect(user.trustTier).toBe('silver');

      const auditLog = await AuditLog.findOne({
        userId,
        action: 'verification_approved',
      });
      expect(auditLog).toBeTruthy();
      expect(auditLog.metadata.adminUserId.toString()).toBe(admin.userId);
    });

    test('admin can reject verification with reason', async () => {
      const { accessToken, userId } = await registerUser();
      await uploadAndSubmit(accessToken);
      const admin = await loginAsAdmin();

      const rejectRes = await request(app)
        .post(`/verification/admin/${userId}/reject`)
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({ reason: 'Document unreadable' });

      expect(rejectRes.statusCode).toBe(200);
      expect(rejectRes.body.data.verification.status).toBe('rejected');
      expect(rejectRes.body.data.verification.rejectionReason).toBe('Document unreadable');

      const User = require('../../../models/User');
      const AuditLog = require('../../../models/AuditLog');
      const user = await User.findById(userId);

      expect(user.accountStatus).toBe('verification_rejected');

      const auditLog = await AuditLog.findOne({
        userId,
        action: 'verification_rejected',
      });
      expect(auditLog).toBeTruthy();
      expect(auditLog.metadata.reason).toBe('Document unreadable');
      expect(auditLog.metadata.adminUserId.toString()).toBe(admin.userId);
    });

    test('reject requires reason in body', async () => {
      const { accessToken, userId } = await registerUser();
      await uploadAndSubmit(accessToken);
      const admin = await loginAsAdmin();

      const rejectRes = await request(app)
        .post(`/verification/admin/${userId}/reject`)
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({});

      expect(rejectRes.statusCode).toBe(400);
    });
  });
});
