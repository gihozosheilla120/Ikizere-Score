# Ikizere Score — MVP MongoDB Schema Design

**Version:** 1.0 (Hackathon MVP)  
**Date:** June 24, 2026  
**Status:** Schema specification only — no implementation  
**Supersedes:** Collection design in `BACKEND_REQUIREMENTS.md` §4

---

## 1. Simplification Summary

The original requirements proposed **27 collections**. For hackathon MVP, this is reduced to **8 collections** — one per core domain.

### 1.1 Collections Removed (and Why)

| Removed Collection | MVP Replacement |
|--------------------|-----------------|
| `refresh_tokens` | `users.refreshTokenHash` (single active session per user) |
| `password_reset_tokens` | `users.passwordResetToken` + `passwordResetExpires` with TTL index |
| `registration_drafts` | Client-side form state; register in one `POST` |
| `business_types` | `BusinessType` enum |
| `record_categories` | `RecordCategory` enum (grouped by record type) |
| `audit_logs` | `financial_records.createdAt` / `updatedAt` |
| `score_history` | `scores.previousScore` + `lastCalculatedAt`; trend chart optional stub |
| `score_factors` | Hard-coded weights in scoring service |
| `score_recommendations` | Computed at API time from `scores.breakdown` |
| `peer_stats` | Simple `$avg` / `$count` on `scores` at request time (or static demo value) |
| `financial_summaries` | MongoDB aggregation on `financial_records` |
| `lenders` | Embedded `lender` subdocument in `loan_products` |
| `loan_purposes` | `LoanPurpose` enum |
| `user_loan_matches` | Computed from `scores` + `loan_products.minScore` |
| `user_requirements` | Computed from `verifications`, `business_profiles`, `financial_records` |
| `user_saved_loans` | `users.savedLoanIds[]` |
| `loan_application_events` | Embedded `timeline[]` in `loan_applications` |
| `notification_logs` | Console / provider webhook only (no persistence) |
| `login_activities` | `users.lastLoginAt` + `lastLoginLocation` only |
| `support_tickets` | Out of scope for MVP |
| `help_categories`, `help_articles`, `faqs` | Static JSON file served by API |
| `languages` | `Language` enum on `users` |

### 1.2 MVP Scope Trims (Non-DB)

| Feature | MVP Approach |
|---------|--------------|
| OAuth (Google/Facebook) | Defer; email/password only |
| 2FA | Flag on user; setup flow stubbed |
| SMS/Email delivery | In-app notifications only; external channels logged to console |
| File storage | Local `/uploads` or Cloudinary free tier; store URL strings |
| Admin verification panel | Auto-approve after 5s or manual MongoDB update for demo |
| Help Center CMS | `help-content.json` static file |

---

## 2. Final Collection Map

| # | Collection | Domain | Cardinality |
|---|------------|--------|-------------|
| 1 | `users` | Authentication (+ settings, saved loans) | 1 per person |
| 2 | `business_profiles` | Business Profiles | 1 per user |
| 3 | `verifications` | Verification (KYC/KYB) | 1 active per user |
| 4 | `financial_records` | Financial Records | Many per user |
| 5 | `scores` | Ikizere Score | 1 per user |
| 6 | `loan_products` | Loan Marketplace | Seed data (~5–10 products) |
| 7 | `loan_applications` | Loan Applications | Many per user |
| 8 | `notifications` | Notifications | Many per user |

**Total: 8 collections**

---

## 3. Collection Relationships

```mermaid
erDiagram
    users ||--o| business_profiles : "has one"
    users ||--o| verifications : "has one"
    users ||--o| scores : "has one"
    users ||--o{ financial_records : "owns many"
    users ||--o{ loan_applications : "submits many"
    users ||--o{ notifications : "receives many"
    loan_products ||--o{ loan_applications : "referenced by"
    users }o--o{ loan_products : "savedLoanIds"

    users {
        ObjectId _id PK
        string email UK
        string phoneNumber UK
        string nationalId UK
        ObjectId[] savedLoanIds FK
    }

    business_profiles {
        ObjectId _id PK
        ObjectId userId FK_UK
    }

    verifications {
        ObjectId _id PK
        ObjectId userId FK_UK
    }

    financial_records {
        ObjectId _id PK
        ObjectId userId FK
    }

    scores {
        ObjectId _id PK
        ObjectId userId FK_UK
    }

    loan_products {
        ObjectId _id PK
    }

    loan_applications {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId productId FK
    }

    notifications {
        ObjectId _id PK
        ObjectId userId FK
    }
```

### 3.1 Relationship Rules

| From | To | Type | Rule |
|------|----|------|------|
| `users` | `business_profiles` | 1:1 | `business_profiles.userId` unique; create on first business form submit |
| `users` | `verifications` | 1:1 | `verifications.userId` unique; upsert on document submit |
| `users` | `scores` | 1:1 | `scores.userId` unique; create on registration with default score `300` |
| `users` | `financial_records` | 1:N | Cascade delete on user delete (dev only) |
| `users` | `loan_applications` | 1:N | User cannot delete if active application exists (optional guard) |
| `users` | `notifications` | 1:N | TTL optional: auto-delete read notifications after 90 days |
| `users` | `loan_products` | N:M | `users.savedLoanIds[]` stores product `_id` references (no join collection) |
| `loan_products` | `loan_applications` | 1:N | `loan_applications.productId` required when applying from marketplace |

### 3.2 Data Flow Dependencies

```
Registration
  └── creates: users, scores (default)

Business onboarding
  └── creates/updates: business_profiles
  └── may update: users.accountStatus

Verification submit
  └── creates/updates: verifications
  └── updates: users.accountStatus, users.trustTier (on approve)

Financial record CRUD
  └── triggers: scores recalculation (service layer)

Score recalculation
  └── updates: scores
  └── may create: notifications (score_changed)

Loan application submit
  └── creates: loan_applications (with embedded timeline)
  └── creates: notifications (loan_submitted)
```

---

## 4. Shared Enums

All enums are defined in application code (`src/constants/enums.js`) — not stored as MongoDB collections.

### 4.1 Authentication & User

```typescript
enum AccountStatus {
  REGISTERED = 'registered',
  PROFILE_INCOMPLETE = 'profile_incomplete',
  VERIFICATION_PENDING = 'verification_pending',
  VERIFIED = 'verified',
  ACTIVE = 'active',
}

enum MembershipTier {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  GOLD = 'gold',
}

enum Language {
  EN = 'en',
  RW = 'rw',
  FR = 'fr',
  SW = 'sw',
}
```

### 4.2 Business

```typescript
enum BusinessType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  SERVICES = 'services',
  AGRICULTURE = 'agriculture',
  MANUFACTURING = 'manufacturing',
  TECHNOLOGY = 'technology',
  HOSPITALITY = 'hospitality',
  OTHER = 'other',
}

enum YearsInOperation {
  LESS_THAN_1 = 'less_than_1',
  ONE_TO_3 = '1_to_3',
  THREE_TO_5 = '3_to_5',
  FIVE_TO_10 = '5_to_10',
  MORE_THAN_10 = 'more_than_10',
}

enum BusinessProfileStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}
```

### 4.3 Verification

```typescript
enum VerificationStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

enum TrustTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  EMERALD = 'emerald',
}
```

### 4.4 Financial Records

```typescript
enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVINGS = 'savings',
}

enum RecordCategory {
  // Income
  RETAIL_SALES = 'retail_sales',
  CLIENT_PAYMENT = 'client_payment',
  SERVICE_INCOME = 'service_income',
  OTHER_INCOME = 'other_income',
  // Expense
  INVENTORY = 'inventory',
  UTILITIES = 'utilities',
  RENT = 'rent',
  SALARIES = 'salaries',
  LOAN_INSTALLMENT = 'loan_installment',
  OTHER_EXPENSE = 'other_expense',
  // Savings
  BUSINESS_SAVINGS = 'business_savings',
  EMERGENCY_FUND = 'emergency_fund',
  OTHER_SAVINGS = 'other_savings',
}

enum PaymentMethod {
  BUSINESS_ACCOUNT = 'business_account',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CREDIT_LINE = 'credit_line',
}

enum Currency {
  RWF = 'RWF',
}
```

### 4.5 Scoring

```typescript
enum ScoreRating {
  EXCELLENT = 'excellent',   // 700+
  GOOD = 'good',             // 550–699
  FAIR = 'fair',             // 400–549
  POOR = 'poor',             // <400
}

enum LoanReadinessRating {
  HIGHLY_ELIGIBLE = 'highly_eligible',
  ELIGIBLE = 'eligible',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  NOT_ELIGIBLE = 'not_eligible',
}
```

### 4.6 Loans

```typescript
enum LoanPurpose {
  INVENTORY_PURCHASE = 'inventory_purchase',
  EQUIPMENT = 'equipment',
  WORKING_CAPITAL = 'working_capital',
  EXPANSION = 'expansion',
  AGRICULTURE_SEASONAL = 'agriculture_seasonal',
  OTHER = 'other',
}

enum InterestRateType {
  FIXED = 'fixed',
  APR = 'apr',
  VARIABLE = 'variable',
}

enum LoanProductTag {
  FAST_APPROVAL = 'fast_approval',
  LOW_INTEREST = 'low_interest',
  BUSINESS_ONLY = 'business_only',
  NO_COLLATERAL = 'no_collateral',
  HIGH_LIMIT = 'high_limit',
}

enum LoanApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
}

enum ApprovalProbability {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

enum TimelineStepStatus {
  COMPLETED = 'completed',
  CURRENT = 'current',
  PENDING = 'pending',
}
```

### 4.7 Notifications

```typescript
enum NotificationType {
  VERIFICATION_SUBMITTED = 'verification_submitted',
  VERIFICATION_APPROVED = 'verification_approved',
  VERIFICATION_REJECTED = 'verification_rejected',
  SCORE_UPDATED = 'score_updated',
  LOAN_SUBMITTED = 'loan_submitted',
  LOAN_STATUS_CHANGED = 'loan_status_changed',
  GENERAL = 'general',
}
```

---

## 5. Dynamically Derived Data (Not Stored)

These API responses are computed at request time — no dedicated collections.

| API Response | Derivation Source |
|--------------|-------------------|
| Dashboard financial summary | `$match` + `$group` on `financial_records` by month |
| Monthly income growth % | Compare current vs previous month aggregates |
| Score recommendations | Rule engine on `scores.breakdown` gaps |
| Peer comparison percentile | `$count` on `scores` where `currentScore < userScore` |
| Loan product match % | `min(score, 100) * product.weight` formula |
| Loan readiness checklist | Rules on `verifications.status`, `business_profiles`, record count |
| Loan payment estimate | Amortization formula from amount + term + `loan_products.interestRate` |
| Record category dropdown | Filter `RecordCategory` enum by `RecordType` |
| Business type dropdown | Return `BusinessType` enum values |
| Loan purpose dropdown | Return `LoanPurpose` enum values |
| Language list | Return `Language` enum with display labels |
| Help center content | Read `help-content.json` |

---

## 6. Mongoose Model Specifications

> **Convention:** All models use `{ timestamps: true }` unless noted.  
> **Types:** Mongoose `Schema.Types.ObjectId` for references.  
> **No code below** — specification only.

---

### 6.1 Model: `User`

**Collection:** `users`  
**Domain:** Authentication

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `email` | String | Yes | — | Unique, lowercase, trim, email format |
| `passwordHash` | String | Yes* | — | *Optional if OAuth added later; bcrypt hash |
| `fullName` | String | Yes | — | Min 2, max 100 chars |
| `phoneNumber` | String | Yes | — | Unique, E.164 format (`+250...`) |
| `nationalId` | String | Yes | — | Unique, immutable after `nationalIdVerified: true` |
| `nationalIdVerified` | Boolean | No | `false` | Set `true` when verification approved |
| `profilePictureUrl` | String | No | `null` | URL to uploaded avatar |
| `businessType` | String (enum) | No | `null` | `BusinessType` enum; set at registration |
| `membershipTier` | String (enum) | No | `'standard'` | `MembershipTier` |
| `memberSince` | Date | No | `Date.now` | Set on registration |
| `accountStatus` | String (enum) | No | `'registered'` | `AccountStatus` |
| `onboardingCompleted` | Boolean | No | `false` | Carousel completion flag |
| `trustTier` | String (enum) | No | `'bronze'` | `TrustTier`; upgraded on verification |
| `verifiedLoanLimit` | Number | No | `0` | RWF; set when score + verification meet threshold |
| `preferredLanguage` | String (enum) | No | `'en'` | `Language` |
| `district` | String | No | `null` | For peer comparison (e.g. `'Kigali'`) |
| `biometricEnabled` | Boolean | No | `false` | Client-side preference mirror |
| `twoFactorEnabled` | Boolean | No | `false` | MVP stub |
| `termsAcceptedAt` | Date | No | `null` | Required at registration |
| `lastLoginAt` | Date | No | `null` | Updated on each login |
| `lastLoginLocation` | String | No | `null` | e.g. `'Kigali, RW'` |
| `refreshTokenHash` | String | No | `null` | SHA-256 of active refresh token |
| `passwordResetToken` | String | No | `null` | Hashed reset token |
| `passwordResetExpires` | Date | No | `null` | TTL index target |
| `savedLoanIds` | [ObjectId] | No | `[]` | Ref → `LoanProduct`; favorites/bookmarks |
| `createdAt` | Date | Auto | — | Timestamp |
| `updatedAt` | Date | Auto | — | Timestamp |

**Indexes:**
- `{ email: 1 }` — unique
- `{ phoneNumber: 1 }` — unique
- `{ nationalId: 1 }` — unique
- `{ passwordResetExpires: 1 }` — TTL, `expireAfterSeconds: 0` (delete token doc fields via `$unset` preferred; or use sparse TTL)

**Instance methods (spec):**
- `comparePassword(plainText)` → boolean
- `toPublicJSON()` → strip `passwordHash`, `refreshTokenHash`, `passwordResetToken`

**Static methods (spec):**
- `findByEmail(email)`
- `findByPhone(phoneNumber)`

**Hooks (spec):**
- `pre('save')` — hash password if modified
- `pre('save')` — block `nationalId` change if `nationalIdVerified`

---

### 6.2 Model: `BusinessProfile`

**Collection:** `business_profiles`  
**Domain:** Business Profiles

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User`, unique (1:1) |
| `businessName` | String | No | `null` | Max 150 chars |
| `yearsInOperation` | String (enum) | No | `null` | `YearsInOperation` |
| `employeeCount` | Number | No | `null` | Min 0, max 100000 |
| `estimatedMonthlyRevenue` | Number | No | `null` | RWF, min 0 |
| `status` | String (enum) | No | `'draft'` | `BusinessProfileStatus` |
| `submittedAt` | Date | No | `null` | Set when status → `submitted` |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1 }` — unique

**Relationships:**
- `userId` → `users._id` (1:1)

---

### 6.3 Model: `Verification`

**Collection:** `verifications`  
**Domain:** Verification

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User`, unique (1:1) |
| `idFrontUrl` | String | No | `null` | Uploaded file URL |
| `idBackUrl` | String | No | `null` | Uploaded file URL |
| `tradeLicenseUrl` | String | No | `null` | PDF or image URL |
| `status` | String (enum) | No | `'not_started'` | `VerificationStatus` |
| `rejectionReason` | String | No | `null` | Set when `rejected` |
| `submittedAt` | Date | No | `null` | |
| `reviewedAt` | Date | No | `null` | |
| `estimatedReviewHours` | Number | No | `24` | Display ETA |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1 }` — unique
- `{ status: 1 }` — for admin/demo auto-approve query

**Relationships:**
- `userId` → `users._id` (1:1)

**Side effects on `status: approved`:**
- Set `users.nationalIdVerified = true`
- Set `users.trustTier = 'emerald'`
- Set `users.accountStatus = 'verified'`

---

### 6.4 Model: `FinancialRecord`

**Collection:** `financial_records`  
**Domain:** Financial Records

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User` |
| `type` | String (enum) | Yes | — | `RecordType` |
| `amount` | Number | Yes | — | Min 0.01, max 999999999 |
| `currency` | String (enum) | No | `'RWF'` | `Currency` |
| `category` | String (enum) | Yes | — | `RecordCategory`; validated against `type` |
| `title` | String | No | `null` | Auto-generated from category if omitted |
| `description` | String | No | `''` | Max 500 chars |
| `date` | Date | Yes | — | Transaction date |
| `paymentMethod` | String (enum) | No | `'mobile_money'` | `PaymentMethod` |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1, date: -1 }`
- `{ userId: 1, type: 1, date: -1 }`
- `{ userId: 1, createdAt: -1 }` — for recent activity

**Validation (spec):**
- `category` must belong to the group matching `type` (custom validator)

**Post-save hook (spec):**
- Call `ScoreService.recalculate(userId)` asynchronously

**Relationships:**
- `userId` → `users._id` (N:1)

---

### 6.5 Model: `Score`

**Collection:** `scores`  
**Domain:** Ikizere Score

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User`, unique (1:1) |
| `currentScore` | Number | No | `300` | Range 300–850 |
| `previousScore` | Number | No | `300` | Snapshot before last recalc |
| `rating` | String (enum) | No | `'fair'` | `ScoreRating`; derived from `currentScore` |
| `monthlyChange` | Number | No | `0` | `currentScore - previousScore` at month boundary |
| `changeReason` | String | No | `''` | e.g. `'consistent repayments'` |
| `loanReadinessPercent` | Number | No | `0` | 0–100 |
| `loanReadinessRating` | String (enum) | No | `'not_eligible'` | `LoanReadinessRating` |
| `percentileRank` | Number | No | `null` | 0–100; computed on read, optionally cached |
| `breakdown` | Object | No | see below | Factor scores 0–100 |
| `breakdown.savingsBehaviour` | Number | No | `0` | |
| `breakdown.incomeStability` | Number | No | `0` | |
| `breakdown.paymentConsistency` | Number | No | `0` | |
| `breakdown.businessActivity` | Number | No | `0` | |
| `breakdown.creditHistory` | Number | No | `0` | |
| `lastCalculatedAt` | Date | No | `null` | |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1 }` — unique
- `{ currentScore: -1 }` — for peer percentile queries

**Scoring weights (service constant, not DB):**

| Factor | Weight |
|--------|--------|
| savingsBehaviour | 25% |
| incomeStability | 20% |
| paymentConsistency | 30% |
| businessActivity | 15% |
| creditHistory | 10% |

**Rating thresholds (service constant):**

| Score Range | Rating |
|-------------|--------|
| 700–850 | excellent |
| 550–699 | good |
| 400–549 | fair |
| 300–399 | poor |

**Relationships:**
- `userId` → `users._id` (1:1)

---

### 6.6 Model: `LoanProduct`

**Collection:** `loan_products`  
**Domain:** Loan Marketplace

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `name` | String | Yes | — | e.g. `'Business Loan'` |
| `description` | String | No | `''` | Short product blurb |
| `lender` | Object | Yes | — | Embedded subdocument (no `lenders` collection) |
| `lender.name` | String | Yes | — | e.g. `'Equity Apex Bank'` |
| `lender.logoUrl` | String | No | `null` | |
| `lender.verified` | Boolean | No | `true` | |
| `maxAmount` | Number | Yes | — | RWF |
| `minAmount` | Number | No | `50000` | RWF |
| `interestRate` | Number | Yes | — | e.g. `8.5` (percent) |
| `interestRateType` | String (enum) | No | `'fixed'` | `InterestRateType` |
| `maxTermMonths` | Number | Yes | — | e.g. `60` |
| `minTermMonths` | Number | No | `3` | |
| `tags` | [String] | No | `[]` | `LoanProductTag` enum values |
| `minScore` | Number | No | `400` | Eligibility floor |
| `processingFee` | Number | No | `5000` | RWF flat fee |
| `isActive` | Boolean | No | `true` | Hide from marketplace if `false` |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ isActive: 1, maxAmount: -1 }`
- `{ 'lender.name': 'text', name: 'text' }` — marketplace search

**Relationships:**
- Referenced by `loan_applications.productId`
- Referenced by `users.savedLoanIds[]`

**Seed data:** 5–8 products matching design mockups (Equity Apex Bank, Global Credit Union, etc.)

---

### 6.7 Model: `LoanApplication`

**Collection:** `loan_applications`  
**Domain:** Loan Applications

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User` |
| `productId` | ObjectId | Yes | — | Ref → `LoanProduct` |
| `applicationNumber` | String | Yes | — | Unique, e.g. `'IK-8829'`; generated |
| `referenceId` | String | Yes | — | Unique, e.g. `'IKZ-2026-8842-19'` |
| `requestedAmount` | Number | Yes | — | RWF, 50000–5000000 |
| `currency` | String (enum) | No | `'RWF'` | |
| `loanPurpose` | String (enum) | Yes | — | `LoanPurpose` |
| `repaymentTermMonths` | Number | Yes | — | 3–36 |
| `monthlyIncome` | Number | No | `null` | RWF |
| `businessDescription` | String | No | `''` | Max 1000 chars |
| `nationalIdUrl` | String | No | `null` | Required if amount > 1,000,000 |
| `businessLicenseUrl` | String | No | `null` | Required if amount > 1,000,000 |
| `status` | String (enum) | No | `'submitted'` | `LoanApplicationStatus` |
| `workflowSteps` | Object | No | see below | Post-submit checklist |
| `workflowSteps.identityVerification` | String | No | `'pending'` | `'done'` \| `'pending'` |
| `workflowSteps.creditScoreValidation` | String | No | `'pending'` | |
| `workflowSteps.fundsDisbursement` | String | No | `'pending'` | |
| `ikizereScoreAtSubmission` | Number | No | `null` | Snapshot from `scores` |
| `estimatedMonthlyPayment` | Number | No | `null` | Calculated at submit |
| `interestRate` | Number | No | `null` | Copied from product |
| `processingFee` | Number | No | `null` | Copied from product |
| `approvalProbability` | String (enum) | No | `'medium'` | `ApprovalProbability` |
| `timeline` | [Object] | No | `[]` | Embedded events (replaces `loan_application_events`) |
| `timeline[].step` | String | Yes | — | e.g. `'application_submitted'` |
| `timeline[].status` | String (enum) | Yes | — | `TimelineStepStatus` |
| `timeline[].message` | String | No | `''` | |
| `timeline[].timestamp` | Date | Yes | — | |
| `timeline[].estimatedDuration` | String | No | `null` | e.g. `'24-48 hours'` |
| `submittedAt` | Date | No | `Date.now` | |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1, submittedAt: -1 }`
- `{ applicationNumber: 1 }` — unique
- `{ referenceId: 1 }` — unique
- `{ status: 1 }`

**Default timeline on create (spec):**

| Step | Initial Status |
|------|----------------|
| `application_submitted` | `completed` |
| `under_review` | `current` |
| `final_approval` | `pending` |
| `disbursement` | `pending` |

**Relationships:**
- `userId` → `users._id` (N:1)
- `productId` → `loan_products._id` (N:1)

**Status transition side effects:**
- On `under_review` → set `workflowSteps.identityVerification` and `creditScoreValidation` to `'done'`
- On `approved` → create notification
- On `disbursed` → set `workflowSteps.fundsDisbursement` to `'done'`

---

### 6.8 Model: `Notification`

**Collection:** `notifications`  
**Domain:** Notifications

| Field | Type | Required | Default | Constraints / Notes |
|-------|------|----------|---------|---------------------|
| `userId` | ObjectId | Yes | — | Ref → `User` |
| `type` | String (enum) | Yes | — | `NotificationType` |
| `title` | String | Yes | — | Max 100 chars |
| `message` | String | Yes | — | Max 500 chars |
| `read` | Boolean | No | `false` | |
| `metadata` | Object | No | `{}` | e.g. `{ applicationId, scoreDelta }` |
| `metadata.applicationId` | ObjectId | No | — | Ref → `LoanApplication` |
| `metadata.referenceId` | String | No | — | |
| `metadata.scoreDelta` | Number | No | — | |
| `createdAt` | Date | Auto | — | |
| `updatedAt` | Date | Auto | — | |

**Indexes:**
- `{ userId: 1, read: 1, createdAt: -1 }`
- `{ userId: 1, createdAt: -1 }`

**Relationships:**
- `userId` → `users._id` (N:1)

---

## 7. Index Summary

| Collection | Index | Type |
|------------|-------|------|
| `users` | `{ email: 1 }` | Unique |
| `users` | `{ phoneNumber: 1 }` | Unique |
| `users` | `{ nationalId: 1 }` | Unique |
| `business_profiles` | `{ userId: 1 }` | Unique |
| `verifications` | `{ userId: 1 }` | Unique |
| `verifications` | `{ status: 1 }` | Standard |
| `financial_records` | `{ userId: 1, date: -1 }` | Standard |
| `financial_records` | `{ userId: 1, type: 1, date: -1 }` | Standard |
| `scores` | `{ userId: 1 }` | Unique |
| `scores` | `{ currentScore: -1 }` | Standard |
| `loan_products` | `{ isActive: 1, maxAmount: -1 }` | Standard |
| `loan_products` | `{ name: 'text', 'lender.name': 'text' }` | Text |
| `loan_applications` | `{ userId: 1, submittedAt: -1 }` | Standard |
| `loan_applications` | `{ applicationNumber: 1 }` | Unique |
| `loan_applications` | `{ referenceId: 1 }` | Unique |
| `notifications` | `{ userId: 1, read: 1, createdAt: -1 }` | Standard |

---

## 8. Seed Data Requirements

| Collection | Seed Count | Notes |
|------------|------------|-------|
| `loan_products` | 5–8 | Match marketplace design; embed lender info |
| `users` | 1 demo user | Optional; for judging demo |
| All others | 0 | Created through user flows |

**Demo user suggestion:**
- Email: `demo@ikizere.rw`
- Pre-populated: `scores` (742), `business_profiles`, `verifications` (approved), 10+ `financial_records`

---

## 9. File Structure (Models Only)

```
Backend/
├── src/
│   ├── constants/
│   │   └── enums.js              # All enums from §4
│   ├── models/
│   │   ├── User.js
│   │   ├── BusinessProfile.js
│   │   ├── Verification.js
│   │   ├── FinancialRecord.js
│   │   ├── Score.js
│   │   ├── LoanProduct.js
│   │   ├── LoanApplication.js
│   │   └── Notification.js
│   ├── services/
│   │   ├── scoreService.js       # Recalculation + derived recommendations
│   │   ├── aggregationService.js # Financial summaries
│   │   └── loanEstimateService.js
│   └── seeds/
│       └── loanProducts.seed.js
```

---

## 10. Comparison: Before vs After

| Metric | Original | MVP |
|--------|----------|-----|
| Collections | 27 | **8** |
| Lookup tables | 5 | **0** (all enums) |
| Pre-computed aggregates | 4 | **0** (aggregation pipeline) |
| Join collections | 4 | **0** (embedded or computed) |
| Auth token collections | 2 | **0** (fields on user) |

---

*End of document.*
