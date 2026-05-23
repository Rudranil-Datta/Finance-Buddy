const express = require('express');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./categories.routes');
const transactionRoutes = require('./transactions.routes');
const budgetRoutes = require('./budgets.routes');
const goalRoutes = require('./goals.routes');
const analyticsRoutes = require('./analytics.routes');
const notificationRoutes = require('./notifications.routes');
const reportRoutes = require('./reports.routes');
const importRoutes = require('./import.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Finance Buddy API is running' });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/import', importRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
