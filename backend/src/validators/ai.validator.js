const { z } = require('zod');

const financialHealthOutputSchema = z.object({
  healthScore: z
    .number()
    .int()
    .min(1, 'healthScore must be between 1 and 100')
    .max(100, 'healthScore must be between 1 and 100'),
  summary: z
    .string()
    .min(20, 'summary must be at least 20 characters')
    .max(1000, 'summary must not exceed 1000 characters'),
  tips: z
    .array(z.string().min(5).max(300))
    .min(1, 'At least one tip is required')
    .max(10, 'Maximum 10 tips allowed'),
  debtAdvice: z.string().min(10).max(500),
  savingsAdvice: z.string().min(10).max(500),
  literacyTip: z.string().min(10).max(500),
});

module.exports = { financialHealthOutputSchema };
