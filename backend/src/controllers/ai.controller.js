const aiService = require('../services/ai.service');
const asyncHandler = require('../utils/asyncHandler');

const getLatest = asyncHandler(async (req, res) => {
  const data = await aiService.getLatestInsight(
    req.user.id,
    req.query.type
  );
  res.json({ success: true, data });
});

const list = asyncHandler(async (req, res) => {
  const data = await aiService.listInsights(req.user.id);
  res.json({ success: true, data });
});

const financialHealth = asyncHandler(async (req, res) => {
  const data = await aiService.generateFinancialHealth(req.user.id);
  res.json({ success: true, data });
});

module.exports = { getLatest, list, financialHealth };
