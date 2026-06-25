const RecordCategory = require('../models/RecordCategory');
const { RecordCategory: RecordCategorySlug } = require('../constants/enums');

const CATEGORY_SEED = [
  { slug: RecordCategorySlug.RETAIL_SALES, name: 'Retail Sales', type: 'income', sortOrder: 1 },
  { slug: RecordCategorySlug.CLIENT_PAYMENT, name: 'Client Payment', type: 'income', sortOrder: 2 },
  { slug: RecordCategorySlug.SERVICE_INCOME, name: 'Service Income', type: 'income', sortOrder: 3 },
  { slug: RecordCategorySlug.OTHER_INCOME, name: 'Other Income', type: 'income', sortOrder: 4 },
  { slug: RecordCategorySlug.INVENTORY, name: 'Inventory Restock', type: 'expense', sortOrder: 1 },
  { slug: RecordCategorySlug.UTILITIES, name: 'Utilities', type: 'expense', sortOrder: 2 },
  { slug: RecordCategorySlug.RENT, name: 'Rent', type: 'expense', sortOrder: 3 },
  { slug: RecordCategorySlug.SALARIES, name: 'Salaries', type: 'expense', sortOrder: 4 },
  { slug: RecordCategorySlug.LOAN_INSTALLMENT, name: 'Loan Installment', type: 'expense', sortOrder: 5 },
  { slug: RecordCategorySlug.OTHER_EXPENSE, name: 'Other Expense', type: 'expense', sortOrder: 6 },
  {
    slug: RecordCategorySlug.BUSINESS_SAVINGS,
    name: 'Business Savings',
    type: 'savings',
    sortOrder: 1,
  },
  { slug: RecordCategorySlug.EMERGENCY_FUND, name: 'Emergency Fund', type: 'savings', sortOrder: 2 },
  { slug: RecordCategorySlug.OTHER_SAVINGS, name: 'Other Savings', type: 'savings', sortOrder: 3 },
];

async function seedRecordCategories() {
  const count = await RecordCategory.countDocuments();
  if (count > 0) {
    return;
  }

  await RecordCategory.insertMany(CATEGORY_SEED);
}

module.exports = { seedRecordCategories, CATEGORY_SEED };
