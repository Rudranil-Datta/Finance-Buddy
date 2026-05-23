const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier format');

const transactionFields = {
  categoryId: objectId,
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['income', 'expense']),
  description: z.string().trim().max(200).optional(),
  date: z.coerce.date({ error: 'Valid date is required' }),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  nextDueDate: z.coerce.date().optional(),
  spendingType: z
    .enum(['recurring_bill', 'one_time', 'discretionary'])
    .optional(),
  source: z.enum(['manual', 'csv', 'mock_bank', 'ocr']).optional(),
};

function recurringRefine(data, ctx) {
  if (data.isRecurring && !data.recurrenceRule) {
    ctx.addIssue({
      code: 'custom',
      message: 'recurrenceRule is required when isRecurring is true',
      path: ['recurrenceRule'],
    });
  }
}

const createTransactionSchema = z
  .object({
    ...transactionFields,
    description: z.string().trim().max(200).optional().default(''),
    isRecurring: z.boolean().optional().default(false),
    spendingType: z
      .enum(['recurring_bill', 'one_time', 'discretionary'])
      .optional()
      .default('one_time'),
    source: z.enum(['manual', 'csv', 'mock_bank', 'ocr']).optional().default('manual'),
  })
  .superRefine(recurringRefine);

const updateTransactionSchema = z
  .object(transactionFields)
  .superRefine(recurringRefine);

const transactionQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  categoryId: objectId.optional(),
  source: z.enum(['manual', 'csv', 'mock_bank', 'ocr']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  isRecurring: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});

const upcomingBillsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).optional().default(14),
});

const idParamSchema = z.object({
  id: objectId,
});

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
  upcomingBillsQuerySchema,
  idParamSchema,
};
