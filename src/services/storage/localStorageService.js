const path = require('path');
const StorageService = require('./storageService');

class LocalStorageService extends StorageService {
  /**
   * Multer already wrote the file to disk. We convert the absolute path to an `/uploads/...` URL.
   */
  async saveUploadedFile({ file }) {
    const uploadsRoot = path.resolve(__dirname, '..', '..', '..', 'uploads');
    const absolutePath = path.resolve(file.path);

    if (!absolutePath.startsWith(uploadsRoot)) {
      throw new Error('Invalid upload path');
    }

    const relativePath = path.relative(uploadsRoot, absolutePath).replaceAll('\\', '/');
    const url = `/uploads/${relativePath}`;
    return { url, relativePath };
  }
}

module.exports = new LocalStorageService();

