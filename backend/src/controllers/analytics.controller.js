const analyticsService = require('../services/analytics.service');
const asyncHandler = require('../utils/asyncHandler');

const monthlyExpenses = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyExpenseSummary(
    req.user.id,
    req.query.startDate,
    req.query.endDate
  );
  res.json({ success: true, data });
});

const categorySpending = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategoryWiseSpending(
    req.user.id,
    req.query.startDate,
    req.query.endDate
  );
  res.json({ success: true, data });
});

const incomeVsExpense = asyncHandler(async (req, res) => {
  const data = await analyticsService.getIncomeVsExpenseAnalytics(
    req.user.id,
    req.query.startDate,
    req.query.endDate
  );
  res.json({ success: true, data });
});

const savingsTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSavingsTrends(req.user.id);
  res.json({ success: true, data });
});

const recentTransactions = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await analyticsService.getRecentTransactionSummary(
    req.user.id,
    limit
  );
  res.json({ success: true, data });
});

const topCategories = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const data = await analyticsService.getTopSpendingCategories(
    req.user.id,
    req.query.startDate,
    req.query.endDate,
    limit
  );
  res.json({ success: true, data });
});

const dashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardSummary(
    req.user.id,
    req.query.startDate,
    req.query.endDate
  );
  res.json({ success: true, data });
});

module.exports = {
  monthlyExpenses,
  categorySpending,
  incomeVsExpense,
  savingsTrends,
  recentTransactions,
  topCategories,
  dashboard,
};
