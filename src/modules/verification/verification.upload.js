const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function safeExtFromMime(mime) {
  if (mime === 'application/pdf') return '.pdf';
  if (mime === 'image/png') return '.png';
  return '.jpg';
}

function buildDiskStorage() {
  return multer.diskStorage({
    destination(req, _file, cb) {
      const userId = req.userId?.toString() || 'anonymous';
      const dest = path.join(__dirname, '..', '..', '..', 'uploads', 'verification', userId);
      ensureDir(dest);
      cb(null, dest);
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname) || safeExtFromMime(file.mimetype);
      const base = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${base}${ext.toLowerCase()}`);
    },
  });
}

function fileFilter(_req, file, cb) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error('Invalid file type. Allowed: jpg, jpeg, png, pdf'));
  }
  return cb(null, true);
}

const upload = multer({
  storage: buildDiskStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 5,
  },
});

const verificationUploadFields = upload.fields([
  { name: 'nationalIdFront', maxCount: 1 },
  { name: 'nationalIdBack', maxCount: 1 },
  { name: 'businessRegistrationCertificate', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 },
]);

module.exports = {
  MAX_FILE_SIZE_BYTES,
  allowedMimeTypes,
  verificationUploadFields,
};

