const express = require('express');
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');
const { aiFinancialHealthRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

router.get('/', aiController.list);
router.get('/latest', aiController.getLatest);
router.post(
  '/financial-health',
  aiFinancialHealthRateLimiter,
  aiController.financialHealth
);

module.exports = router;
