/**
 * Pure helper functions for generating realistic seed data.
 */

const EXPENSE_DESCRIPTIONS = {
  food: ['Grocery store', 'Meal prep', 'Cafe'],
  groceries: ['Whole Foods', 'Trader Joes', 'Costco run', 'Farmers market'],
  dining: ['Coffee shop', 'Lunch with team', 'Dinner delivery', 'Weekend brunch'],
  transport: ['Uber ride', 'Gas station', 'Metro card', 'Parking fee'],
  bills: ['Electric bill', 'Internet bill', 'Insurance payment'],
  utilities: ['Electric bill', 'Internet bill', 'Water bill'],
  rent: ['Monthly rent'],
  entertainment: ['Netflix', 'Spotify', 'Movie tickets', 'Concert'],
  shopping: ['Amazon order', 'Clothing store', 'Electronics'],
  health: ['Pharmacy', 'Gym membership', 'Doctor copay'],
  education: ['Online course', 'Books', 'Tuition fee'],
  other: ['Misc purchase', 'Cash expense'],
  salary: ['Paycheck', 'Freelance payment', 'Bonus'],
  investment: ['Dividend', 'Stock sale', 'Interest'],
};

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

/**
 * Generate expense amount with category-specific ranges and weekend bump.
 */
function generateExpenseAmount(categorySlug, date) {
  const ranges = {
    food: [15, 90],
    groceries: [40, 180],
    dining: [12, 85],
    transport: [8, 65],
    bills: [50, 200],
    utilities: [60, 220],
    rent: [1200, 1800],
    entertainment: [10, 120],
    shopping: [25, 350],
    health: [15, 150],
    education: [30, 400],
    other: [5, 75],
  };

  const [min, max] = ranges[categorySlug] || [10, 100];
  let amount = randomBetween(min, max);

  const day = date.getDay();
  if (categorySlug === 'dining' && (day === 0 || day === 6)) {
    amount *= 1.25;
  }

  return Math.round(amount * 100) / 100;
}

function generateIncomeAmount() {
  return randomBetween(3200, 5200);
}

function pickDescription(categorySlug) {
  const list = EXPENSE_DESCRIPTIONS[categorySlug] || ['Purchase'];
  return randomItem(list);
}

/**
 * Build transactions for the last N days with monthly patterns:
 * - Salary on 1st and 15th
 * - Rent on 1st
 * - Higher dining on weekends
 * - Utilities mid-month
 */
function generateTransactionsForUser(userId, categories, days = 90) {
  const transactions = [];
  const categoryBySlug = Object.fromEntries(
    categories.map((c) => [c.slug, c])
  );

  const incomeCat = categories.find((c) => c.type === 'income');
  const expenseCats = categories.filter((c) => c.type !== 'income');

  for (let d = days; d >= 0; d--) {
    const date = daysAgo(d);
    const dayOfMonth = date.getDate();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (dayOfMonth === 1 || dayOfMonth === 15) {
      transactions.push({
        userId,
        categoryId: incomeCat._id,
        amount: generateIncomeAmount(),
        type: 'income',
        description: randomItem(EXPENSE_DESCRIPTIONS.salary),
        date,
        spendingType: 'one_time',
        source: d % 30 === 0 ? 'mock_bank' : 'manual',
      });
    }

    if (dayOfMonth === 1 && categoryBySlug.rent) {
      transactions.push({
        userId,
        categoryId: categoryBySlug.rent._id,
        amount: generateExpenseAmount('rent', date),
        type: 'expense',
        description: 'Monthly rent',
        date,
        isRecurring: true,
        recurrenceRule: 'monthly',
        nextDueDate: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        spendingType: 'recurring_bill',
        source: 'manual',
      });
    }

    if (dayOfMonth === 15 && categoryBySlug.utilities) {
      transactions.push({
        userId,
        categoryId: categoryBySlug.utilities._id,
        amount: generateExpenseAmount('utilities', date),
        type: 'expense',
        description: 'Utility bills',
        date,
        isRecurring: true,
        recurrenceRule: 'monthly',
        spendingType: 'recurring_bill',
        source: 'manual',
      });
    }

    const dailyExpenseCount = isWeekend ? randomBetween(2, 4) : randomBetween(1, 3);
    for (let i = 0; i < dailyExpenseCount; i++) {
      const cat = randomItem(expenseCats.filter((c) => c.slug !== 'rent'));
      if (!cat) continue;

      transactions.push({
        userId,
        categoryId: cat._id,
        amount: generateExpenseAmount(cat.slug, date),
        type: 'expense',
        description: pickDescription(cat.slug),
        date: new Date(date.getTime() + i * 3600000),
        spendingType:
          cat.type === 'discretionary' ? 'discretionary' : 'one_time',
        source: Math.random() > 0.85 ? 'csv' : 'manual',
      });
    }
  }

  return transactions;
}

function generateBudgetsForUser(userId, categories) {
  const expenseCats = categories.filter((c) => c.type !== 'income');
  const limits = {
    groceries: 500,
    dining: 350,
    transport: 200,
    utilities: 250,
    entertainment: 150,
    shopping: 400,
    health: 120,
  };

  return expenseCats
    .filter((c) => limits[c.slug])
    .map((c) => ({
      userId,
      categoryId: c._id,
      limitAmount: limits[c.slug],
      period: 'monthly',
      alertThresholdPct: 80,
      isActive: true,
    }));
}

function generateSavingsGoalsForUser(userId) {
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 6);

  return [
    {
      userId,
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2150,
      deadline,
      status: 'active',
      milestones: [
        { label: '25% saved', amount: 1250, reachedAt: daysAgo(45) },
        { label: '50% saved', amount: 2500 },
      ],
    },
    {
      userId,
      title: 'Vacation to Japan',
      targetAmount: 3000,
      currentAmount: 890,
      deadline: new Date(deadline.getFullYear(), deadline.getMonth() + 3, 1),
      status: 'active',
      milestones: [
        { label: 'Flight deposit', amount: 500, reachedAt: daysAgo(20) },
      ],
    },
  ];
}

function generateNotificationsForUser(userId, budgets, goals) {
  const notifications = [
    {
      userId,
      type: 'bill_due',
      title: 'Rent due soon',
      message: 'Your rent payment is due in 3 days.',
      read: false,
      dueDate: daysAgo(-3),
      priority: 'high',
      relatedModel: 'Transaction',
    },
    {
      userId,
      type: 'system',
      title: 'Welcome to Finance Buddy',
      message: 'Explore your dashboard to track spending and savings goals.',
      read: true,
      priority: 'low',
    },
  ];

  if (budgets[0]) {
    notifications.push({
      userId,
      type: 'budget_exceeded',
      title: 'Dining budget warning',
      message: 'You have used 85% of your dining budget this month.',
      read: false,
      priority: 'medium',
      relatedEntityId: budgets[0].categoryId,
      relatedModel: 'Budget',
    });
  }

  if (goals[0]) {
    notifications.push({
      userId,
      type: 'goal_milestone',
      title: 'Emergency Fund milestone',
      message: 'You reached 25% of your Emergency Fund goal!',
      read: false,
      priority: 'medium',
      relatedEntityId: goals[0]._id,
      relatedModel: 'SavingsGoal',
    });
  }

  return notifications;
}

module.exports = {
  randomBetween,
  randomItem,
  daysAgo,
  startOfMonth,
  generateExpenseAmount,
  generateTransactionsForUser,
  generateBudgetsForUser,
  generateSavingsGoalsForUser,
  generateNotificationsForUser,
};
