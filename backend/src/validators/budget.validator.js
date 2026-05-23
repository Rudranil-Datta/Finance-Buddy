const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier format');

const createBudgetSchema = z.object({
  categoryId: objectId,
  limitAmount: z.coerce.number().min(1, 'Budget limit must be at least 1'),
  period: z.enum(['weekly', 'monthly']).optional().default('monthly'),
  alertThresholdPct: z.coerce.number().min(50).max(100).optional().default(80),
  isActive: z.boolean().optional().default(true),
});

const updateBudgetSchema = createBudgetSchema.partial();

const idParamSchema = z.object({
  id: objectId,
});

module.exports = { createBudgetSchema, updateBudgetSchema, idParamSchema };
