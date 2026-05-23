const goalService = require('../services/goal.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const goals = await goalService.listByUser(req.user.id, req.query);
  res.json({ success: true, data: goals });
});

const getOne = asyncHandler(async (req, res) => {
  const goal = await goalService.getById(req.user.id, req.params.id);
  res.json({ success: true, data: goal });
});

const create = asyncHandler(async (req, res) => {
  const goal = await goalService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: goal });
});

const update = asyncHandler(async (req, res) => {
  const goal = await goalService.update(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: goal });
});

const remove = asyncHandler(async (req, res) => {
  await goalService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: 'Savings goal deleted' });
});

const contribute = asyncHandler(async (req, res) => {
  const goal = await goalService.contribute(
    req.user.id,
    req.params.id,
    req.body.amount
  );
  res.json({ success: true, data: goal });
});

module.exports = { list, getOne, create, update, remove, contribute };
