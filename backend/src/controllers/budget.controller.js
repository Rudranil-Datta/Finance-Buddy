const budgetService = require('../services/budget.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const budgets = await budgetService.listByUser(req.user.id);
  res.json({ success: true, data: budgets });
});

const getStatus = asyncHandler(async (req, res) => {
  const status = await budgetService.getStatus(req.user.id);
  res.json({ success: true, data: status });
});

const getOne = asyncHandler(async (req, res) => {
  const budget = await budgetService.getById(req.user.id, req.params.id);
  res.json({ success: true, data: budget });
});

const create = asyncHandler(async (req, res) => {
  const budget = await budgetService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: budget });
});

const update = asyncHandler(async (req, res) => {
  const budget = await budgetService.update(
    req.user.id,
    req.params.id,
    req.body
  );
  res.json({ success: true, data: budget });
});

const remove = asyncHandler(async (req, res) => {
  await budgetService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: 'Budget deleted' });
});

module.exports = { list, getStatus, getOne, create, update, remove };
