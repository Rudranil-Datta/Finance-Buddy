const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');

const exportCsv = asyncHandler(async (req, res) => {
  const csv = await reportService.exportTransactionsCsv(
    req.user.id,
    req.query
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="finance-buddy-export.csv"'
  );
  res.send(csv);
});

const summary = asyncHandler(async (req, res) => {
  const data = await reportService.getSummary(
    req.user.id,
    req.query.startDate,
    req.query.endDate
  );
  res.json({ success: true, data });
});

module.exports = { exportCsv, summary };
