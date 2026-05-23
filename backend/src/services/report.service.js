const { Transaction } = require('../models');

/**
 * Build a CSV string of transactions for export.
 */
async function exportTransactionsCsv(userId, filters = {}) {
  const query = { userId };

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }
  if (filters.type) query.type = filters.type;

  const transactions = await Transaction.find(query)
    .populate('categoryId', 'name')
    .sort({ date: -1 });

  const headers = [
    'Date',
    'Type',
    'Category',
    'Amount',
    'Description',
    'Source',
    'SpendingType',
  ];

  const rows = transactions.map((t) => [
    t.date.toISOString().split('T')[0],
    t.type,
    t.categoryId?.name || '',
    t.amount,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.source,
    t.spendingType,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

async function getSummary(userId, startDate, endDate) {
  const analyticsService = require('./analytics.service');
  return analyticsService.getDashboardSummary(userId, startDate, endDate);
}

module.exports = { exportTransactionsCsv, getSummary };
