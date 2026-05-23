require('dotenv').config();

const bcrypt = require('bcrypt');
const { connectDatabase, disconnectDatabase } = require('../config/db');
const {
  User,
  Category,
  Transaction,
  Budget,
  SavingsGoal,
  Notification,
  OCRDocument,
  AIInsight,
} = require('../models');
const { DEFAULT_CATEGORIES, DEMO_USERS } = require('./seed/constants');
const {
  generateTransactionsForUser,
  generateBudgetsForUser,
  generateSavingsGoalsForUser,
  generateNotificationsForUser,
  daysAgo,
} = require('./seed/generators');

const SALT_ROUNDS = 12;
const shouldClear = process.argv.includes('--clear');

async function clearDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Transaction.deleteMany({}),
    Budget.deleteMany({}),
    SavingsGoal.deleteMany({}),
    Notification.deleteMany({}),
    OCRDocument.deleteMany({}),
    AIInsight.deleteMany({}),
  ]);
  console.log('Cleared all collections.');
}

async function seedUser(demoUser, isPrimaryDemo = false) {
  const passwordHash = await bcrypt.hash(demoUser.password, SALT_ROUNDS);

  const user = await User.create({
    email: demoUser.email,
    passwordHash,
    name: demoUser.name,
    currency: demoUser.currency,
    role: 'user',
    isActive: true,
  });

  const categories = await Category.insertMany(
    DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId: user._id,
      isDefault: true,
    }))
  );

  const categoryDocs = categories.map((doc) => ({
    _id: doc._id,
    slug: doc.slug,
    type: doc.type,
    name: doc.name,
  }));

  const transactions = generateTransactionsForUser(
    user._id,
    categoryDocs,
    90
  );

  await Transaction.insertMany(transactions);
  console.log(`  ${transactions.length} transactions for ${user.email}`);

  const budgetPayloads = generateBudgetsForUser(user._id, categoryDocs);
  const budgets = await Budget.insertMany(budgetPayloads);

  const goalPayloads = generateSavingsGoalsForUser(user._id);
  const goals = await SavingsGoal.insertMany(goalPayloads);

  const notifications = generateNotificationsForUser(
    user._id,
    budgets,
    goals
  );
  await Notification.insertMany(notifications);

  if (isPrimaryDemo) {
    const ocrDoc = await OCRDocument.create({
      userId: user._id,
      filename: 'receipt-march-grocery.pdf',
      mimeType: 'application/pdf',
      fileSize: 245000,
      storagePath: '/uploads/demo/receipt-march-grocery.pdf',
      status: 'processed',
      extractedText: 'Whole Foods Market - Total $87.42',
      parsedTransactionCount: 1,
      processedAt: daysAgo(5),
    });

    await Transaction.create({
      userId: user._id,
      categoryId: categories.find((c) => c.slug === 'groceries')._id,
      amount: 87.42,
      type: 'expense',
      description: 'OCR imported receipt',
      date: daysAgo(5),
      source: 'ocr',
      ocrDocumentId: ocrDoc._id,
      spendingType: 'one_time',
    });

    await AIInsight.create({
      userId: user._id,
      type: 'financial_health',
      healthScore: 72,
      summary:
        'Spending is stable with dining as the largest discretionary category. Savings rate is moderate.',
      tips: [
        'Reduce dining out by 10% to free up $35/month.',
        'Your emergency fund is 43% complete — keep contributing.',
        'Utilities spending is within budget.',
      ],
      inputSnapshot: {
        totalIncome: 9800,
        totalExpense: 7200,
        savingsRate: 26.5,
        topCategory: 'dining',
      },
      model: 'gemini-2.0-flash',
      expiresAt: daysAgo(-7),
    });

    await Notification.create({
      userId: user._id,
      type: 'ai_insight',
      title: 'New financial health insight',
      message: 'Your latest AI assessment score is 72/100.',
      read: false,
      priority: 'low',
      relatedModel: 'AIInsight',
    });
  }

  return {
    user,
    categories: categories.length,
    transactions: transactions.length,
    budgets: budgets.length,
    goals: goals.length,
    notifications: notifications.length,
  };
}

async function runSeed() {
  console.log('Connecting to MongoDB...');
  await connectDatabase();

  if (shouldClear) {
    await clearDatabase();
  }

  const results = [];
  for (let i = 0; i < DEMO_USERS.length; i++) {
    const demo = DEMO_USERS[i];
    const existing = await User.findOne({ email: demo.email });
    if (existing && !shouldClear) {
      console.log(`Skipping ${demo.email} (already exists). Use --clear to reset.`);
      continue;
    }

    if (existing && shouldClear) {
      await User.deleteOne({ _id: existing._id });
    }

    console.log(`Seeding ${demo.email}...`);
    const result = await seedUser(demo, i === 0);
    results.push(result);
  }

  console.log('\nSeed complete.');
  console.log('Demo credentials: demo@financebuddy.local / Demo1234!');
  results.forEach((r) => {
    if (r) {
      console.log(
        `  ${r.user.email}: ${r.categories} categories, ${r.transactions} txns, ${r.budgets} budgets, ${r.goals} goals`
      );
    }
  });

  await disconnectDatabase();
}

runSeed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
