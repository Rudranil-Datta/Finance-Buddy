/**
 * Rule-based financial health assessment when data is sparse or Gemini is unavailable.
 * No external API — instant, suitable for new users with few transactions.
 */
function buildLocalFinancialHealthAssessment(snapshot) {
  const income = snapshot.totalIncome ?? 0;
  const expense = snapshot.totalExpense ?? 0;
  const net = snapshot.netSavings ?? 0;
  const txCount = snapshot.transactionCount ?? 0;
  const budgetsAlert = snapshot.budgetsWarningOrOver ?? 0;

  let healthScore = 58;

  if (income > 0) {
    const savingsRate = net / income;
    healthScore = Math.round(Math.min(90, Math.max(30, 52 + savingsRate * 75)));
  } else if (expense > 0 && income === 0) {
    healthScore = 42;
  } else if (txCount === 0) {
    healthScore = 50;
  }

  if (net < 0) {
    healthScore = Math.max(22, healthScore - 12);
  }

  if (budgetsAlert > 0) {
    healthScore = Math.max(20, healthScore - 8 * budgetsAlert);
  }

  if (txCount > 0 && txCount < 5) {
    healthScore = Math.min(healthScore, 68);
  }

  const sparse = txCount < 5;
  const currencyHint =
    income || expense
      ? `Income $${income.toFixed(2)}, expenses $${expense.toFixed(2)}, net $${net.toFixed(2)}.`
      : 'Limited transaction history so far.';

  const summary = sparse
    ? `You have ${txCount} transaction${txCount === 1 ? '' : 's'} on record. ${currencyHint} This is a starter assessment based on your data — add more transactions over a few weeks, then generate again for a full AI review via Gemini.`
    : `${currencyHint} This assessment uses your aggregated app data. For deeper pattern analysis, keep recording transactions regularly.`;

  const tips = [
    sparse
      ? 'Log income and expenses consistently for 2–4 weeks to unlock richer AI insights.'
      : 'Review your top spending categories monthly and adjust budgets where you overspend.',
    net < 0
      ? 'Spending exceeded income in this period — prioritize essentials and pause discretionary purchases.'
      : 'Aim to save at least 10–20% of income when possible; automate transfers on payday.',
    budgetsAlert > 0
      ? `${budgetsAlert} budget(s) are in warning or over limit — check the Budgets page.`
      : 'Set category budgets for your largest expenses to catch drift early.',
  ].filter(Boolean);

  return {
    healthScore,
    summary,
    tips: tips.slice(0, 5),
    debtAdvice:
      'If you carry high-interest debt, list balances by APR and pay extra toward the highest rate while making minimums on the rest.',
    savingsAdvice:
      net >= 0
        ? 'Direct part of each paycheck to a separate savings account before discretionary spending.'
        : 'Stabilize monthly cash flow first, then rebuild savings with small automatic transfers.',
    literacyTip:
      'Track every transaction for one month — awareness alone often reduces unnecessary spending by 10–15%.',
  };
}

/** Minimum transactions before calling Gemini (slower, richer). */
const MIN_TRANSACTIONS_FOR_GEMINI = Number(
  process.env.AI_MIN_TRANSACTIONS_FOR_GEMINI || 5
);

function shouldUseGemini(snapshot) {
  return (snapshot.transactionCount ?? 0) >= MIN_TRANSACTIONS_FOR_GEMINI;
}

module.exports = {
  buildLocalFinancialHealthAssessment,
  shouldUseGemini,
  MIN_TRANSACTIONS_FOR_GEMINI,
};
