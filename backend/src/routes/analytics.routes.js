const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', analyticsController.dashboard);
router.get('/monthly', analyticsController.monthlyExpenses);
router.get('/by-category', analyticsController.categorySpending);
router.get('/income-vs-expense', analyticsController.incomeVsExpense);
router.get('/savings-trends', analyticsController.savingsTrends);
router.get('/recent', analyticsController.recentTransactions);
router.get('/top-categories', analyticsController.topCategories);

module.exports = router;
