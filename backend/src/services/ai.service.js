const ApiError = require('../utils/ApiError');
const { AIInsight } = require('../models');
const analyticsService = require('./analytics.service');
const budgetService = require('./budget.service');
const notificationService = require('./notification.service');
const {
  runFinancialHealthChain,
  getGeminiModel,
  CACHE_TTL_MS,
} = require('../ai/financialHealth.chain');
const {
  buildLocalFinancialHealthAssessment,
  shouldUseGemini,
  MIN_TRANSACTIONS_FOR_GEMINI,
} = require('../ai/localFinancialHealth');

/**
 * Build aggregated-only snapshot for the LangChain prompt (no PII).
 */
async function buildFinancialHealthSnapshot(userId) {
  const [summary, categorySpending, savingsTrends, budgetStatuses] =
    await Promise.all([
      analyticsService.getDashboardSummary(userId),
      analyticsService.getCategoryWiseSpending(userId),
      analyticsService.getSavingsTrends(userId),
      budgetService.getStatus(userId),
    ]);

  const topExpenseCategories = categorySpending.slice(0, 3).map((row) => ({
    categoryName: row.categoryName,
    percentage: row.percentage,
    total: row.total,
  }));

  const savingsGoalsProgress = savingsTrends
    .filter((goal) => goal.status === 'active')
    .map((goal) => ({
      title: goal.title,
      progressPct: goal.progressPct,
      remaining: goal.remaining,
    }));

  const budgetsWarningOrOver = budgetStatuses.filter(
    (status) => status.isWarning || status.isOver
  ).length;

  return {
    totalIncome: Math.round((summary.totalIncome ?? 0) * 100) / 100,
    totalExpense: Math.round((summary.totalExpense ?? 0) * 100) / 100,
    netSavings: Math.round((summary.netSavings ?? 0) * 100) / 100,
    transactionCount: summary.transactionCount ?? 0,
    topExpenseCategories,
    savingsGoalsProgress,
    budgetsWarningOrOver,
  };
}

/**
 * Return the latest cached AI insight or a computed snapshot for the insights UI.
 */
async function getLatestInsight(userId, type = 'financial_health') {
  const cached = await AIInsight.findOne({ userId, type })
    .sort({ createdAt: -1 })
    .lean();

  if (cached) {
    const cacheValid =
      cached.expiresAt && new Date(cached.expiresAt) > new Date();
    return {
      ...cached,
      cached: Boolean(cacheValid),
      cacheExpired: Boolean(cached.expiresAt && !cacheValid),
    };
  }

  const summary = await analyticsService.getDashboardSummary(userId);
  return {
    type,
    healthScore: null,
    summary: 'Run POST /api/ai/financial-health to generate a LangChain assessment.',
    tips: [],
    inputSnapshot: {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      netSavings: summary.netSavings,
    },
    cached: false,
  };
}

async function listInsights(userId) {
  return AIInsight.find({ userId }).sort({ createdAt: -1 }).limit(10);
}

/**
 * Generate financial health assessment via LangChain + Google Gemini.
 * Uses 24h cache when a non-expired insight exists.
 */
async function generateFinancialHealth(userId) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new ApiError(
      503,
      'AI service unavailable: GOOGLE_API_KEY is not configured. Add your Google AI Studio key to backend/.env'
    );
  }

  const type = 'financial_health';
  const now = new Date();

  const cached = await AIInsight.findOne({
    userId,
    type,
    expiresAt: { $gt: now },
  })
    .sort({ createdAt: -1 })
    .lean();

  if (cached) {
    return {
      ...cached,
      cached: true,
      cacheExpired: false,
    };
  }

  const inputSnapshot = await buildFinancialHealthSnapshot(userId);
  let assessment;
  let model;

  if (shouldUseGemini(inputSnapshot)) {
    try {
      assessment = await runFinancialHealthChain(inputSnapshot);
      model = getGeminiModel();
    } catch (err) {
      assessment = buildLocalFinancialHealthAssessment(inputSnapshot);
      model = 'local-rules-fallback';
      console.warn(
        'Gemini assessment failed, using local fallback:',
        err.message
      );
    }
  } else {
    assessment = buildLocalFinancialHealthAssessment(inputSnapshot);
    model = 'local-rules-v1';
  }
  const expiresAt = new Date(Date.now() + CACHE_TTL_MS);

  const insight = await AIInsight.create({
    userId,
    type,
    healthScore: assessment.healthScore,
    summary: assessment.summary,
    tips: assessment.tips,
    debtAdvice: assessment.debtAdvice,
    savingsAdvice: assessment.savingsAdvice,
    literacyTip: assessment.literacyTip,
    inputSnapshot,
    model,
    expiresAt,
  });

  try {
    await notificationService.create(userId, {
      type: 'ai_insight',
      title: 'New financial health insight',
      message: `Your latest AI assessment score is ${assessment.healthScore}/100.`,
      read: false,
      priority: 'low',
      relatedEntityId: insight._id,
      relatedModel: 'AIInsight',
    });
  } catch {
    // Non-blocking — insight is still returned if notification fails
  }

  const doc = insight.toObject();
  return { ...doc, cached: false, cacheExpired: false };
}

module.exports = {
  getLatestInsight,
  listInsights,
  generateFinancialHealth,
  buildFinancialHealthSnapshot,
  MIN_TRANSACTIONS_FOR_GEMINI,
};
