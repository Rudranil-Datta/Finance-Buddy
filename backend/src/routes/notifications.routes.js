const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');
const {
  validateQuery,
  validateParams,
} = require('../middleware/validate');
const {
  notificationQuerySchema,
  upcomingBillsQuerySchema,
  idParamSchema,
} = require('../validators/notification.validator');

const router = express.Router();

router.use(protect);

router.get(
  '/upcoming-bills',
  validateQuery(upcomingBillsQuerySchema),
  notificationController.upcomingBills
);
router.post(
  '/sync-bill-reminders',
  validateQuery(upcomingBillsQuerySchema),
  notificationController.syncBillReminders
);
router.get('/', validateQuery(notificationQuerySchema), notificationController.list);
router.patch('/read-all', notificationController.markAllRead);
router.patch(
  '/:id/read',
  validateParams(idParamSchema),
  notificationController.markRead
);

module.exports = router;
