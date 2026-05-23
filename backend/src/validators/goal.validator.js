const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier format');

const milestoneSchema = z.object({
  label: z.string().trim().min(1, 'Milestone label is required'),
  amount: z.coerce.number().min(0, 'Milestone amount must be non-negative'),
  reachedAt: z.coerce.date().optional(),
});

const createGoalSchema = z.object({
  title: z.string().trim().min(1).max(100),
  targetAmount: z.coerce.number().min(1, 'Target amount must be at least 1'),
  currentAmount: z.coerce.number().min(0).optional().default(0),
  deadline: z.coerce.date().optional(),
  milestones: z.array(milestoneSchema).optional().default([]),
  status: z.enum(['active', 'completed', 'paused']).optional().default('active'),
});

const updateGoalSchema = createGoalSchema.partial();

const contributeSchema = z.object({
  amount: z.coerce.number().positive('Contribution must be a positive amount'),
});

const goalQuerySchema = z.object({
  status: z.enum(['active', 'completed', 'paused']).optional(),
});

const idParamSchema = z.object({
  id: objectId,
});

module.exports = {
  createGoalSchema,
  updateGoalSchema,
  contributeSchema,
  goalQuerySchema,
  idParamSchema,
};
