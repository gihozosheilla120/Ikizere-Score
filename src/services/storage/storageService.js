class StorageService {
  /**
   * Persist an uploaded file and return a public URL.
   * For local development, Multer disk storage persists the file already and we just map the path to a URL.
   *
   * @param {object} params
   * @param {import('multer').File} params.file
   * @param {string} params.userId
   * @param {string} params.purpose
   * @returns {Promise<{ url: string, relativePath: string }>}
   */
  // eslint-disable-next-line no-unused-vars
  async saveUploadedFile({ file, userId, purpose }) {
    throw new Error('Not implemented');
  }
}

module.exports = StorageService;

