const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { getPeriodRange } = require('../utils/period');
const { Budget, Transaction, Category } = require('../models');

/**
 * Sum expense transactions for a category within the budget period.
 */
async function computeSpentAmount(userId, categoryId, period = 'monthly') {
  const { start, end } = getPeriodRange(period);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [result] = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        categoryId: new mongoose.Types.ObjectId(categoryId),
        type: 'expense',
        date: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, spent: { $sum: '$amount' } } },
  ]);

  return Math.round((result?.spent || 0) * 100) / 100;
}

/**
 * Build budget status object with spent, percentage, and flags.
 */
function buildBudgetStatus(budget, spent) {
  const pctUsed =
    budget.limitAmount > 0
      ? Math.round((spent / budget.limitAmount) * 1000) / 10
      : 0;
  const isOver = spent > budget.limitAmount;
  const isWarning = pctUsed >= budget.alertThresholdPct && !isOver;

  return {
    budget,
    spent,
    limitAmount: budget.limitAmount,
    pctUsed,
    remaining: Math.round((budget.limitAmount - spent) * 100) / 100,
    isOver,
    isWarning,
    alertThresholdPct: budget.alertThresholdPct,
  };
}

/**
 * Recompute spent for a category's active budget and return status.
 */
async function recomputeBudgetSpent(userId, categoryId) {
  const budget = await Budget.findOne({
    userId,
    categoryId,
    isActive: true,
  }).populate('categoryId', 'name color slug type');

  if (!budget) {
    return null;
  }

  const spent = await computeSpentAmount(
    userId,
    categoryId,
    budget.period
  );

  return buildBudgetStatus(budget, spent);
}

async function listByUser(userId) {
  return Budget.find({ userId, isActive: true }).populate(
    'categoryId',
    'name color slug type'
  );
}

async function getById(userId, budgetId) {
  const budget = await Budget.findOne({ _id: budgetId, userId }).populate(
    'categoryId',
    'name color slug type'
  );

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  return budget;
}

async function create(userId, data) {
  const category = await Category.findOne({ _id: data.categoryId, userId });
  if (!category) {
    throw new ApiError(400, 'Invalid category for this user');
  }

  if (category.type === 'income') {
    throw new ApiError(400, 'Budgets cannot be set on income categories');
  }

  try {
    const budget = await Budget.create({ ...data, userId });
    return budget.populate('categoryId', 'name color slug type');
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        'Budget already exists for this category and period'
      );
    }
    throw err;
  }
}

async function update(userId, budgetId, data) {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, userId },
    data,
    { new: true, runValidators: true }
  ).populate('categoryId', 'name color slug type');

  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  return budget;
}

async function remove(userId, budgetId) {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
  if (!budget) {
    throw new ApiError(404, 'Budget not found');
  }
  return budget;
}

/**
 * Full status for all active budgets (dashboard use).
 */
async function getStatus(userId) {
  const budgets = await Budget.find({ userId, isActive: true }).populate(
    'categoryId',
    'name color slug type'
  );

  const statuses = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await computeSpentAmount(
        userId,
        budget.categoryId._id,
        budget.period
      );
      return buildBudgetStatus(budget, spent);
    })
  );

  return statuses;
}

module.exports = {
  computeSpentAmount,
  buildBudgetStatus,
  recomputeBudgetSpent,
  listByUser,
  getById,
  create,
  update,
  remove,
  getStatus,
};
