const transactionService = require('../services/transaction.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const transactions = await transactionService.listByUser(
    req.user.id,
    req.query
  );
  res.json({ success: true, data: transactions });
});

const listUpcomingRecurring = asyncHandler(async (req, res) => {
  const bills = await transactionService.getUpcomingRecurring(
    req.user.id,
    req.query.days
  );
  res.json({ success: true, data: bills });
});

const getOne = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getById(
    req.user.id,
    req.params.id
  );
  res.json({ success: true, data: transaction });
});

const create = asyncHandler(async (req, res) => {
  const transaction = await transactionService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: transaction });
});

const update = asyncHandler(async (req, res) => {
  const transaction = await transactionService.update(
    req.user.id,
    req.params.id,
    req.body
  );
  res.json({ success: true, data: transaction });
});

const remove = asyncHandler(async (req, res) => {
  await transactionService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: 'Transaction deleted' });
});

module.exports = {
  list,
  listUpcomingRecurring,
  getOne,
  create,
  update,
  remove,
};
