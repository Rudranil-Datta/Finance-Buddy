const ApiError = require('../utils/ApiError');
const { computeNextDueDate } = require('../utils/period');
const { Transaction, Category } = require('../models');
const budgetService = require('./budget.service');
const notificationService = require('./notification.service');

function buildListQuery(userId, filters) {
  const query = { userId };

  if (filters.type) query.type = filters.type;
  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.source) query.source = filters.source;
  if (filters.isRecurring !== undefined) query.isRecurring = filters.isRecurring;

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  return query;
}

/**
 * Normalize recurring fields and derive nextDueDate when missing.
 */
function normalizeRecurringFields(data) {
  const payload = { ...data };

  if (payload.isRecurring) {
    if (!payload.recurrenceRule) {
      throw new ApiError(
        400,
        'recurrenceRule is required when isRecurring is true'
      );
    }
    if (!payload.nextDueDate) {
      payload.nextDueDate = computeNextDueDate(
        payload.date || new Date(),
        payload.recurrenceRule
      );
    }
    if (payload.type === 'expense' && payload.spendingType === 'one_time') {
      payload.spendingType = 'recurring_bill';
    }
  } else {
    payload.recurrenceRule = undefined;
    payload.nextDueDate = undefined;
  }

  return payload;
}

async function assertCategoryOwnership(userId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    throw new ApiError(400, 'Invalid category for this user');
  }
  return category;
}

/**
 * Recompute budget spent and create threshold notifications for expense categories.
 */
async function processBudgetSideEffects(userId, categoryId, transactionType) {
  if (transactionType !== 'expense') {
    return null;
  }
  return notificationService.handleBudgetAfterTransaction(userId, categoryId);
}

async function listByUser(userId, filters = {}) {
  const limit = Math.min(parseInt(filters.limit, 10) || 50, 200);
  const query = buildListQuery(userId, filters);

  return Transaction.find(query)
    .populate('categoryId', 'name color type slug')
    .sort({ date: -1 })
    .limit(limit);
}

async function getUpcomingRecurring(userId, daysAhead = 14) {
  return notificationService.getUpcomingBills(userId, daysAhead);
}

async function getById(userId, transactionId) {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  }).populate('categoryId', 'name color type slug');

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }
  return transaction;
}

async function create(userId, data) {
  const payload = normalizeRecurringFields(data);
  await assertCategoryOwnership(userId, payload.categoryId);

  const transaction = await Transaction.create({ ...payload, userId });
  await transaction.populate('categoryId', 'name color type slug');

  await processBudgetSideEffects(
    userId,
    transaction.categoryId._id,
    transaction.type
  );

  if (transaction.isRecurring && transaction.nextDueDate) {
    const daysUntilDue = Math.ceil(
      (transaction.nextDueDate - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDue <= 14) {
      await notificationService.createBillDueReminder(userId, transaction);
    }
  }

  return transaction;
}

async function update(userId, transactionId, data) {
  const existing = await Transaction.findOne({ _id: transactionId, userId });
  if (!existing) {
    throw new ApiError(404, 'Transaction not found');
  }

  const merged = normalizeRecurringFields({
    categoryId: data.categoryId ?? existing.categoryId,
    amount: data.amount ?? existing.amount,
    type: data.type ?? existing.type,
    description: data.description ?? existing.description,
    date: data.date ?? existing.date,
    isRecurring: data.isRecurring ?? existing.isRecurring,
    recurrenceRule: data.recurrenceRule ?? existing.recurrenceRule,
    nextDueDate: data.nextDueDate ?? existing.nextDueDate,
    spendingType: data.spendingType ?? existing.spendingType,
    source: data.source ?? existing.source,
  });

  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, userId },
    merged,
    { new: true, runValidators: true }
  ).populate('categoryId', 'name color type slug');

  const categoriesToCheck = new Set([
    existing.categoryId.toString(),
    transaction.categoryId._id.toString(),
  ]);

  for (const categoryId of categoriesToCheck) {
    await processBudgetSideEffects(userId, categoryId, 'expense');
  }

  if (transaction.isRecurring && transaction.nextDueDate) {
    await notificationService.createBillDueReminder(userId, transaction);
  }

  return transaction;
}

async function remove(userId, transactionId) {
  const transaction = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }

  if (transaction.type === 'expense') {
    await processBudgetSideEffects(
      userId,
      transaction.categoryId,
      transaction.type
    );
  }

  return transaction;
}

module.exports = {
  listByUser,
  getUpcomingRecurring,
  getById,
  create,
  update,
  remove,
  normalizeRecurringFields,
};
