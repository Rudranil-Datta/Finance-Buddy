const mongoose = require('mongoose');
const { Transaction, SavingsGoal } = require('../models');

/**
 * Base match stage scoped to a user and optional date range.
 * Reused across pipelines to avoid duplicating filter logic.
 */
function buildUserDateMatch(userId, startDate, endDate) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return { $match: match };
}

/**
 * Monthly expense summary grouped by year-month.
 * Returns: { period, totalExpense, transactionCount }
 */
async function getMonthlyExpenseSummary(userId, startDate, endDate) {
  const pipeline = [
    buildUserDateMatch(userId, startDate, endDate),
    { $match: { type: 'expense' } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        totalExpense: { $sum: '$amount' },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
        totalExpense: { $round: ['$totalExpense', 2] },
        transactionCount: 1,
      },
    },
    { $sort: { period: 1 } },
  ];

  return Transaction.aggregate(pipeline);
}

/**
 * Category-wise spending with category name lookup.
 * Returns: { categoryId, categoryName, total, count, percentage }
 */
async function getCategoryWiseSpending(userId, startDate, endDate) {
  const pipeline = [
    buildUserDateMatch(userId, startDate, endDate),
    { $match: { type: 'expense' } },
    {
      $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: null,
        items: {
          $push: {
            categoryId: '$_id',
            categoryName: '$category.name',
            color: '$category.color',
            total: '$total',
            count: '$count',
          },
        },
        grandTotal: { $sum: '$total' },
      },
    },
    { $unwind: '$items' },
    {
      $project: {
        _id: 0,
        categoryId: '$items.categoryId',
        categoryName: '$items.categoryName',
        color: '$items.color',
        total: { $round: ['$items.total', 2] },
        count: '$items.count',
        percentage: {
          $round: [
            {
              $multiply: [
                { $divide: ['$items.total', '$grandTotal'] },
                100,
              ],
            },
            1,
          ],
        },
      },
    },
    { $sort: { total: -1 } },
  ];

  return Transaction.aggregate(pipeline);
}

/**
 * Income vs expense totals per month for trend charts.
 * Returns: { period, income, expense, netSavings }
 */
async function getIncomeVsExpenseAnalytics(userId, startDate, endDate) {
  const pipeline = [
    buildUserDateMatch(userId, startDate, endDate),
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
        income: { $round: ['$income', 2] },
        expense: { $round: ['$expense', 2] },
        netSavings: { $round: [{ $subtract: ['$income', '$expense'] }, 2] },
      },
    },
    { $sort: { period: 1 } },
  ];

  return Transaction.aggregate(pipeline);
}

/**
 * Savings goals progress trends for dashboard.
 * Returns active goals with progress percentage.
 */
async function getSavingsTrends(userId) {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['active', 'completed'] },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        targetAmount: 1,
        currentAmount: 1,
        deadline: 1,
        status: 1,
        progressPct: {
          $round: [
            {
              $min: [
                100,
                {
                  $multiply: [
                    { $divide: ['$currentAmount', '$targetAmount'] },
                    100,
                  ],
                },
              ],
            },
            1,
          ],
        },
        remaining: {
          $round: [{ $subtract: ['$targetAmount', '$currentAmount'] }, 2],
        },
      },
    },
    { $sort: { progressPct: -1 } },
  ];

  return SavingsGoal.aggregate(pipeline);
}

/**
 * Recent transactions with category details for activity feed.
 */
async function getRecentTransactionSummary(userId, limit = 10) {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    { $sort: { date: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 1,
        amount: 1,
        type: 1,
        description: 1,
        date: 1,
        spendingType: 1,
        source: 1,
        categoryName: '$category.name',
        categoryColor: '$category.color',
      },
    },
  ];

  return Transaction.aggregate(pipeline);
}

/**
 * Top spending categories (limited) for quick dashboard widgets.
 */
async function getTopSpendingCategories(userId, startDate, endDate, limit = 5) {
  const results = await getCategoryWiseSpending(userId, startDate, endDate);
  return results.slice(0, limit);
}

/**
 * Dashboard summary combining key metrics in a single efficient pass.
 * Uses $facet to run parallel sub-pipelines on the same matched set.
 */
async function getDashboardSummary(userId, startDate, endDate) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const dateFilter = {};

  if (startDate || endDate) {
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
  }

  const matchStage = {
    userId: userObjectId,
    ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
  };

  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ],
        topCategories: [
          { $match: { type: 'expense' } },
          {
            $group: {
              _id: '$categoryId',
              total: { $sum: '$amount' },
            },
          },
          { $sort: { total: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'category',
            },
          },
          { $unwind: '$category' },
          {
            $project: {
              categoryId: '$_id',
              categoryName: '$category.name',
              color: '$category.color',
              total: { $round: ['$total', 2] },
            },
          },
        ],
        monthlyExpenses: [
          { $match: { type: 'expense' } },
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' },
              },
              total: { $sum: '$amount' },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          {
            $project: {
              period: {
                $concat: [
                  { $toString: '$_id.year' },
                  '-',
                  {
                    $cond: [
                      { $lt: ['$_id.month', 10] },
                      { $concat: ['0', { $toString: '$_id.month' }] },
                      { $toString: '$_id.month' },
                    ],
                  },
                ],
              },
              total: { $round: ['$total', 2] },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalIncome: {
          $let: {
            vars: {
              income: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$totals',
                      as: 't',
                      cond: { $eq: ['$$t._id', 'income'] },
                    },
                  },
                  0,
                ],
              },
            },
            in: { $ifNull: ['$$income.total', 0] },
          },
        },
        totalExpense: {
          $let: {
            vars: {
              expense: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$totals',
                      as: 't',
                      cond: { $eq: ['$$t._id', 'expense'] },
                    },
                  },
                  0,
                ],
              },
            },
            in: { $ifNull: ['$$expense.total', 0] },
          },
        },
        transactionCount: { $sum: '$totals.count' },
        topCategories: 1,
        monthlyExpenses: 1,
      },
    },
    {
      $addFields: {
        netSavings: { $subtract: ['$totalIncome', '$totalExpense'] },
      },
    },
  ];

  const [summary] = await Transaction.aggregate(pipeline);
  const goals = await getSavingsTrends(userId);

  return {
    ...summary,
    savingsGoals: goals,
  };
}

module.exports = {
  buildUserDateMatch,
  getMonthlyExpenseSummary,
  getCategoryWiseSpending,
  getIncomeVsExpenseAnalytics,
  getSavingsTrends,
  getRecentTransactionSummary,
  getTopSpendingCategories,
  getDashboardSummary,
};
