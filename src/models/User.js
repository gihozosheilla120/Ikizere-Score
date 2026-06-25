const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const softDeletePlugin = require('./plugins/softDelete');
const {
  AccountStatus,
  MembershipTier,
  Language,
  BusinessType,
  TrustTier,
  UserRole,
  enumValues,
} = require('../constants/enums');

const SALT_ROUNDS = 12;
const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [E164_PHONE_REGEX, 'Phone number must be in E.164 format (e.g. +250788000000)'],
    },
    nationalId: {
      type: String,
      required: [true, 'National ID is required'],
      trim: true,
    },
    nationalIdVerified: {
      type: Boolean,
      default: false,
    },
    profilePictureUrl: {
      type: String,
      default: null,
    },
    businessType: {
      type: String,
      enum: {
        values: enumValues(BusinessType),
        message: '{VALUE} is not a valid business type',
      },
      default: null,
    },
    membershipTier: {
      type: String,
      enum: {
        values: enumValues(MembershipTier),
        message: '{VALUE} is not a valid membership tier',
      },
      default: MembershipTier.STANDARD,
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: {
        values: enumValues(UserRole),
        message: '{VALUE} is not a valid user role',
      },
      default: UserRole.USER,
      index: true,
    },
    accountStatus: {
      type: String,
      enum: {
        values: enumValues(AccountStatus),
        message: '{VALUE} is not a valid account status',
      },
      default: AccountStatus.REGISTERED,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    trustTier: {
      type: String,
      enum: {
        values: enumValues(TrustTier),
        message: '{VALUE} is not a valid trust tier',
      },
      default: TrustTier.BRONZE,
    },
    verifiedLoanLimit: {
      type: Number,
      default: 0,
      min: [0, 'Verified loan limit cannot be negative'],
    },
    preferredLanguage: {
      type: String,
      enum: {
        values: enumValues(Language),
        message: '{VALUE} is not a valid language',
      },
      default: Language.EN,
    },
    district: {
      type: String,
      default: null,
      trim: true,
    },
    biometricEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginLocation: {
      type: String,
      default: null,
      trim: true,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    savedLoanIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoanProduct',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.plugin(softDeletePlugin);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);
userSchema.index(
  { phoneNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);
userSchema.index(
  { nationalId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);

userSchema.pre('save', async function hashPassword(next) {
  try {
    if (this.isModified('password') && this.password) {
      this.passwordHash = await bcrypt.hash(this.password, SALT_ROUNDS);
      this.password = undefined;
    }

    if (this.isNew && !this.passwordHash) {
      return next(new Error('Password is required'));
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', function protectNationalId(next) {
  if (!this.isModified('nationalId') || this.isNew) {
    return next();
  }

  if (this.nationalIdVerified) {
    return next(new Error('National ID cannot be changed after verification'));
  }

  next();
});

userSchema.methods.comparePassword = async function comparePassword(plainTextPassword) {
  if (!plainTextPassword || !this.passwordHash) {
    return false;
  }
  return bcrypt.compare(plainTextPassword, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordHash;
  delete obj.refreshTokenHash;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

userSchema.statics.findByEmail = function findByEmail(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.statics.findByPhone = function findByPhone(phoneNumber) {
  return this.findOne({ phoneNumber: phoneNumber.trim() });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
