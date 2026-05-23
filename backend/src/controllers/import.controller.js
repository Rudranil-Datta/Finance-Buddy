const importService = require('../services/import.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const csv = asyncHandler(async (req, res) => {
  const content = req.body.csv || req.file?.buffer?.toString('utf-8');
  if (!content) {
    throw new ApiError(400, 'CSV content is required in body.csv or file upload');
  }
  const result = await importService.importCsv(req.user.id, content);
  res.status(201).json({ success: true, data: result });
});

module.exports = { csv };
