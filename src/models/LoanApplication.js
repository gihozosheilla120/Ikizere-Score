const mongoose = require('mongoose');
const softDeletePlugin = require('./plugins/softDelete');
const {
  Currency,
  LoanPurpose,
  LoanApplicationStatus,
  ApprovalProbability,
  TimelineStepStatus,
  WorkflowStepState,
  enumValues,
} = require('../constants/enums');

const HIGH_AMOUNT_THRESHOLD = 1000000;

const workflowStepsSchema = new mongoose.Schema(
  {
    identityVerification: {
      type: String,
      enum: {
        values: enumValues(WorkflowStepState),
        message: '{VALUE} is not a valid workflow step state',
      },
      default: WorkflowStepState.PENDING,
    },
    creditScoreValidation: {
      type: String,
      enum: {
        values: enumValues(WorkflowStepState),
        message: '{VALUE} is not a valid workflow step state',
      },
      default: WorkflowStepState.PENDING,
    },
    fundsDisbursement: {
      type: String,
      enum: {
        values: enumValues(WorkflowStepState),
        message: '{VALUE} is not a valid workflow step state',
      },
      default: WorkflowStepState.PENDING,
    },
  },
  { _id: false }
);

const timelineEventSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      required: [true, 'Timeline step is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Timeline status is required'],
      enum: {
        values: enumValues(TimelineStepStatus),
        message: '{VALUE} is not a valid timeline step status',
      },
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Timeline message cannot exceed 500 characters'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timeline timestamp is required'],
    },
    estimatedDuration: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

function buildDefaultTimeline() {
  const now = new Date();
  return [
    {
      step: 'application_submitted',
      status: TimelineStepStatus.COMPLETED,
      message: 'Your documents were successfully uploaded and verified.',
      timestamp: now,
    },
    {
      step: 'under_review',
      status: TimelineStepStatus.CURRENT,
      message: 'Your application is being reviewed.',
      timestamp: now,
      estimatedDuration: '24-48 hours',
    },
    {
      step: 'final_approval',
      status: TimelineStepStatus.PENDING,
      message: 'Waiting for review completion',
      timestamp: now,
    },
    {
      step: 'disbursement',
      status: TimelineStepStatus.PENDING,
      message: 'Pending approval',
      timestamp: now,
    },
  ];
}

const loanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanProduct',
      required: [true, 'Loan product ID is required'],
    },
    applicationNumber: {
      type: String,
      required: [true, 'Application number is required'],
      trim: true,
    },
    referenceId: {
      type: String,
      required: [true, 'Reference ID is required'],
      trim: true,
    },
    requestedAmount: {
      type: Number,
      required: [true, 'Requested amount is required'],
      min: [50000, 'Minimum loan amount is 50,000 RWF'],
      max: [5000000, 'Maximum loan amount is 5,000,000 RWF'],
    },
    currency: {
      type: String,
      enum: {
        values: enumValues(Currency),
        message: '{VALUE} is not a supported currency',
      },
      default: Currency.RWF,
    },
    loanPurpose: {
      type: String,
      required: [true, 'Loan purpose is required'],
      enum: {
        values: enumValues(LoanPurpose),
        message: '{VALUE} is not a valid loan purpose',
      },
    },
    repaymentTermMonths: {
      type: Number,
      required: [true, 'Repayment term is required'],
      min: [3, 'Minimum repayment term is 3 months'],
      max: [36, 'Maximum repayment term is 36 months'],
    },
    monthlyIncome: {
      type: Number,
      default: null,
      min: [0, 'Monthly income cannot be negative'],
    },
    businessDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Business description cannot exceed 1000 characters'],
    },
    nationalIdUrl: {
      type: String,
      default: null,
    },
    businessLicenseUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: enumValues(LoanApplicationStatus),
        message: '{VALUE} is not a valid application status',
      },
      default: LoanApplicationStatus.SUBMITTED,
    },
    workflowSteps: {
      type: workflowStepsSchema,
      default: () => ({}),
    },
    ikizereScoreAtSubmission: {
      type: Number,
      default: null,
      min: 300,
      max: 850,
    },
    estimatedMonthlyPayment: {
      type: Number,
      default: null,
      min: [0, 'Estimated monthly payment cannot be negative'],
    },
    interestRate: {
      type: Number,
      default: null,
      min: [0, 'Interest rate cannot be negative'],
    },
    processingFee: {
      type: Number,
      default: null,
      min: [0, 'Processing fee cannot be negative'],
    },
    approvalProbability: {
      type: String,
      enum: {
        values: enumValues(ApprovalProbability),
        message: '{VALUE} is not a valid approval probability',
      },
      default: ApprovalProbability.MEDIUM,
    },
    timeline: {
      type: [timelineEventSchema],
      default: buildDefaultTimeline,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

loanApplicationSchema.plugin(softDeletePlugin);

loanApplicationSchema.index({ userId: 1, submittedAt: -1 });
loanApplicationSchema.index(
  { applicationNumber: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);
loanApplicationSchema.index(
  { referenceId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } }
);
loanApplicationSchema.index({ status: 1 });

loanApplicationSchema.pre('validate', function validateHighAmountDocuments(next) {
  if (this.requestedAmount > HIGH_AMOUNT_THRESHOLD) {
    if (!this.nationalIdUrl) {
      this.invalidate('nationalIdUrl', 'National ID is required for loans above 1,000,000 RWF');
    }
    if (!this.businessLicenseUrl) {
      this.invalidate(
        'businessLicenseUrl',
        'Business license is required for loans above 1,000,000 RWF'
      );
    }
  }
  next();
});

loanApplicationSchema.pre('save', function syncWorkflowSteps(next) {
  if (!this.isModified('status')) {
    return next();
  }

  if (this.status === LoanApplicationStatus.UNDER_REVIEW) {
    this.workflowSteps.identityVerification = WorkflowStepState.DONE;
    this.workflowSteps.creditScoreValidation = WorkflowStepState.DONE;
  }

  if (this.status === LoanApplicationStatus.DISBURSED) {
    this.workflowSteps.fundsDisbursement = WorkflowStepState.DONE;
  }

  next();
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;
