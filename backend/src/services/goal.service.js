const ApiError = require('../utils/ApiError');
const { SavingsGoal } = require('../models');
const notificationService = require('./notification.service');

/**
 * Compute goal progress metrics.
 */
function computeProgress(goal) {
  const progressPct =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round((goal.currentAmount / goal.targetAmount) * 1000) / 10
        )
      : 0;

  return {
    currentAmount: goal.currentAmount,
    targetAmount: goal.targetAmount,
    remaining: Math.max(
      0,
      Math.round((goal.targetAmount - goal.currentAmount) * 100) / 100
    ),
    progressPct,
    isComplete: goal.currentAmount >= goal.targetAmount,
  };
}

function formatGoalWithProgress(goal) {
  const doc = goal.toObject ? goal.toObject() : goal;
  return {
    ...doc,
    progress: computeProgress(goal),
  };
}

async function listByUser(userId, filters = {}) {
  const query = { userId };
  if (filters.status) query.status = filters.status;

  const goals = await SavingsGoal.find(query).sort({ createdAt: -1 });
  return goals.map(formatGoalWithProgress);
}

async function getById(userId, goalId) {
  const goal = await SavingsGoal.findOne({ _id: goalId, userId });
  if (!goal) {
    throw new ApiError(404, 'Savings goal not found');
  }
  return formatGoalWithProgress(goal);
}

async function create(userId, data) {
  const goal = await SavingsGoal.create({ ...data, userId });
  return formatGoalWithProgress(goal);
}

async function update(userId, goalId, data) {
  const goal = await SavingsGoal.findOneAndUpdate(
    { _id: goalId, userId },
    data,
    { new: true, runValidators: true }
  );

  if (!goal) {
    throw new ApiError(404, 'Savings goal not found');
  }
  return formatGoalWithProgress(goal);
}

async function remove(userId, goalId) {
  const goal = await SavingsGoal.findOneAndDelete({ _id: goalId, userId });
  if (!goal) {
    throw new ApiError(404, 'Savings goal not found');
  }
  return goal;
}

/**
 * Add contribution, detect milestones, update status, and notify.
 */
async function contribute(userId, goalId, amount) {
  const goal = await SavingsGoal.findOne({ _id: goalId, userId });

  if (!goal) {
    throw new ApiError(404, 'Savings goal not found');
  }

  if (goal.status === 'completed') {
    throw new ApiError(400, 'Goal is already completed');
  }

  const previousAmount = goal.currentAmount;
  goal.currentAmount = Math.round((goal.currentAmount + amount) * 100) / 100;

  const newlyReached = [];

  for (const milestone of goal.milestones) {
    if (
      !milestone.reachedAt &&
      previousAmount < milestone.amount &&
      goal.currentAmount >= milestone.amount
    ) {
      milestone.reachedAt = new Date();
      newlyReached.push(milestone);
    }
  }

  const wasComplete = previousAmount >= goal.targetAmount;
  const isNowComplete = goal.currentAmount >= goal.targetAmount;

  if (isNowComplete && !wasComplete) {
    goal.status = 'completed';
  }

  await goal.save();

  for (const milestone of newlyReached) {
    await notificationService.createGoalMilestoneAlert(userId, goal, milestone);
  }

  if (isNowComplete && !wasComplete) {
    await notificationService.createGoalCompletedAlert(userId, goal);
  }

  return formatGoalWithProgress(goal);
}

module.exports = {
  computeProgress,
  formatGoalWithProgress,
  listByUser,
  getById,
  create,
  update,
  remove,
  contribute,
};
