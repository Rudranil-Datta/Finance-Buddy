const mongoose = require('mongoose');
const { getPeriodRange } = require('../utils/period');
const { Notification, Budget, Transaction } = require('../models');

async function listByUser(userId, filters = {}) {
  const query = { userId };
  if (filters.read !== undefined) query.read = filters.read;
  if (filters.type) query.type = filters.type;

  const limit = Math.min(parseInt(filters.limit, 10) || 50, 100);

  return Notification.find(query).sort({ createdAt: -1 }).limit(limit);
}

async function markAsRead(userId, notificationId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return { success: true };
}

async function create(userId, payload) {
  return Notification.create({ ...payload, userId });
}

/**
 * Create or skip duplicate budget alert for current period.
 */
async function notifyBudgetThreshold(userId, budgetStatus) {
  const { budget, spent, pctUsed, isOver, isWarning } = budgetStatus;

  if (!isWarning && !isOver) {
    return null;
  }

  const { start } = getPeriodRange(budget.period);
  const type = isOver ? 'budget_exceeded' : 'budget_warning';
  const categoryName = budget.categoryId?.name || 'Category';

  const existing = await Notification.findOne({
    userId,
    type,
    relatedEntityId: budget._id,
    createdAt: { $gte: start },
  });

  if (existing) {
    return existing;
  }

  const title = isOver
    ? `${categoryName} budget exceeded`
    : `${categoryName} budget warning`;

  const message = isOver
    ? `You exceeded your ${categoryName} budget ($${spent} / $${budget.limitAmount}).`
    : `You have used ${pctUsed}% of your ${categoryName} budget ($${spent} / $${budget.limitAmount}).`;

  return Notification.create({
    userId,
    type,
    title,
    message,
    relatedEntityId: budget._id,
    relatedModel: 'Budget',
    priority: isOver ? 'high' : 'medium',
  });
}

/**
 * After a transaction change, recompute budget and notify if needed.
 */
async function handleBudgetAfterTransaction(userId, categoryId) {
  const budgetService = require('./budget.service');
  const status = await budgetService.recomputeBudgetSpent(userId, categoryId);

  if (!status) {
    return null;
  }

  return notifyBudgetThreshold(userId, status);
}

/**
 * Goal milestone reached notification.
 */
async function createGoalMilestoneAlert(userId, goal, milestone) {
  const existing = await Notification.findOne({
    userId,
    type: 'goal_milestone',
    relatedEntityId: goal._id,
    message: { $regex: milestone.label, $options: 'i' },
  });

  if (existing) return existing;

  return Notification.create({
    userId,
    type: 'goal_milestone',
    title: `${goal.title} milestone reached`,
    message: `You reached "${milestone.label}" ($${milestone.amount}) on your ${goal.title} goal.`,
    relatedEntityId: goal._id,
    relatedModel: 'SavingsGoal',
    priority: 'medium',
  });
}

/**
 * Goal fully funded notification.
 */
async function createGoalCompletedAlert(userId, goal) {
  const existing = await Notification.findOne({
    userId,
    type: 'goal_completed',
    relatedEntityId: goal._id,
  });

  if (existing) return existing;

  return Notification.create({
    userId,
    type: 'goal_completed',
    title: `${goal.title} completed`,
    message: `Congratulations! You reached your target of $${goal.targetAmount}.`,
    relatedEntityId: goal._id,
    relatedModel: 'SavingsGoal',
    priority: 'high',
  });
}

/**
 * Bill due reminder for a recurring transaction.
 */
async function createBillDueReminder(userId, transaction) {
  const existing = await Notification.findOne({
    userId,
    type: 'bill_due',
    relatedEntityId: transaction._id,
    dueDate: transaction.nextDueDate,
  });

  if (existing) return existing;

  return Notification.create({
    userId,
    type: 'bill_due',
    title: 'Upcoming bill payment',
    message: `${transaction.description || 'Recurring bill'} of $${transaction.amount} is due on ${transaction.nextDueDate.toLocaleDateString()}.`,
    dueDate: transaction.nextDueDate,
    relatedEntityId: transaction._id,
    relatedModel: 'Transaction',
    priority: 'high',
  });
}

/**
 * Scan recurring transactions and create bill_due notifications within window.
 */
async function syncUpcomingBillReminders(userId, daysAhead = 7) {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + daysAhead);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const upcoming = await Transaction.find({
    userId: userObjectId,
    isRecurring: true,
    nextDueDate: { $gte: now, $lte: end },
  }).sort({ nextDueDate: 1 });

  const created = [];
  for (const txn of upcoming) {
    const notification = await createBillDueReminder(userId, txn);
    if (notification) created.push(notification);
  }

  return created;
}

/**
 * Query upcoming recurring bills (no side effects).
 */
async function getUpcomingBills(userId, daysAhead = 14) {
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + daysAhead);

  return Transaction.find({
    userId,
    isRecurring: true,
    nextDueDate: { $gte: now, $lte: end },
  })
    .populate('categoryId', 'name color slug')
    .sort({ nextDueDate: 1 });
}

/**
 * Legacy batch check — delegates per budget category.
 */
async function checkBudgetThresholds(userId) {
  const budgets = await Budget.find({ userId, isActive: true });
  const budgetService = require('./budget.service');
  const results = [];

  for (const budget of budgets) {
    const status = await budgetService.recomputeBudgetSpent(
      userId,
      budget.categoryId
    );
    if (status) {
      const notification = await notifyBudgetThreshold(userId, status);
      if (notification) results.push(notification);
    }
  }

  return results;
}

module.exports = {
  listByUser,
  markAsRead,
  markAllAsRead,
  create,
  notifyBudgetThreshold,
  handleBudgetAfterTransaction,
  createGoalMilestoneAlert,
  createGoalCompletedAlert,
  createBillDueReminder,
  syncUpcomingBillReminders,
  getUpcomingBills,
  checkBudgetThresholds,
};
