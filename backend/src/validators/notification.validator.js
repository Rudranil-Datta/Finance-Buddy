const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier format');

const notificationQuerySchema = z.object({
  read: z.enum(['true', 'false']).optional(),
  type: z
    .enum([
      'budget_warning',
      'budget_exceeded',
      'bill_due',
      'goal_milestone',
      'goal_completed',
      'system',
      'ai_insight',
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const upcomingBillsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).optional().default(7),
});

const idParamSchema = z.object({
  id: objectId,
});

module.exports = {
  notificationQuerySchema,
  upcomingBillsQuerySchema,
  idParamSchema,
};
