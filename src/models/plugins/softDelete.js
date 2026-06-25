/**
 * Soft-delete plugin: excludes deleted documents from queries by default.
 * Pass { includeDeleted: true } as a query option to include them.
 */
function softDeletePlugin(schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  const excludeDeleted = function (next) {
    if (this.getOptions().includeDeleted) {
      return next();
    }

    this.where({ isDeleted: { $ne: true } });
    next();
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);
  schema.pre('estimatedDocumentCount', excludeDeleted);

  schema.methods.softDelete = function softDelete() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function restore() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  schema.statics.findWithDeleted = function findWithDeleted(filter = {}) {
    return this.find(filter).setOptions({ includeDeleted: true });
  };

  schema.statics.findOneWithDeleted = function findOneWithDeleted(filter = {}) {
    return this.findOne(filter).setOptions({ includeDeleted: true });
  };
}

module.exports = softDeletePlugin;
