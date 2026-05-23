/**
 * Date range helpers for budget period calculations.
 */

function getMonthlyRange(referenceDate = new Date()) {
  const start = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const end = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function getWeeklyRange(referenceDate = new Date()) {
  const day = referenceDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(referenceDate);
  start.setDate(referenceDate.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function getPeriodRange(period, referenceDate = new Date()) {
  if (period === 'weekly') return getWeeklyRange(referenceDate);
  return getMonthlyRange(referenceDate);
}

/**
 * Advance a date by recurrence rule for next due date.
 */
function computeNextDueDate(fromDate, recurrenceRule) {
  const next = new Date(fromDate);

  switch (recurrenceRule) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      break;
  }

  return next;
}

module.exports = {
  getMonthlyRange,
  getWeeklyRange,
  getPeriodRange,
  computeNextDueDate,
};
