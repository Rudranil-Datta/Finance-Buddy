const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.listByUser(req.user.id, req.query);
  res.json({ success: true, data: categories });
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: category });
});

module.exports = { list, create };
