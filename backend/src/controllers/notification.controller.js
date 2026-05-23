const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const list = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listByUser(
    req.user.id,
    req.query
  );
  res.json({ success: true, data: notifications });
});

const upcomingBills = asyncHandler(async (req, res) => {
  const bills = await notificationService.getUpcomingBills(
    req.user.id,
    req.query.days
  );
  res.json({ success: true, data: bills });
});

const syncBillReminders = asyncHandler(async (req, res) => {
  const created = await notificationService.syncUpcomingBillReminders(
    req.user.id,
    req.query.days
  );
  res.json({
    success: true,
    data: { created: created.length, notifications: created },
  });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.user.id,
    req.params.id
  );
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }
  res.json({ success: true, data: notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  res.json({ success: true, data: result });
});

module.exports = {
  list,
  upcomingBills,
  syncBillReminders,
  markRead,
  markAllRead,
};
