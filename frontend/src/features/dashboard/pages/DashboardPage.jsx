import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RefreshCw, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { ROUTES } from '@/app/router/paths.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import { formatCurrency } from '@/utils/format.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import StatCard, { StatCardBadge } from '@/components/ui/StatCard.jsx'
import Button from '@/components/ui/Button.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import SuccessMessage from '@/components/feedback/SuccessMessage.jsx'
import SectionHeader from '@/components/ui/SectionHeader.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'
import {
  RecentTransactions,
  BudgetStatusWidget,
  InsightCard,
  ExpenseTrendChart,
  CategoryDonutChart,
} from '../components/index.js'

export default function DashboardPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const [welcomeMessage, setWelcomeMessage] = useState(
    location.state?.authSuccess ? location.state.message : null,
  )

  const {
    loading,
    usingMock,
    error,
    summary,
    monthlyTrend,
    categorySpending,
    recentTransactions,
    budgetStatuses,
    insights,
    hasLiveAiInsight,
    expenseDelta,
    refresh,
  } = useDashboardData()

  useEffect(() => {
    if (!location.state?.authSuccess) return
    navigate(location.pathname, { replace: true, state: {} })
    const timer = setTimeout(() => setWelcomeMessage(null), 6000)
    return () => clearTimeout(timer)
  }, [location.pathname, location.state?.authSuccess, navigate])

  const greeting = getGreeting()
  const displayName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="page-stack">
      <PageHeader
        title={`${greeting}, ${displayName}`}
        description="Your financial overview — income, spending, budgets, and AI insights."
        action={
          <Button
            variant="secondary"
            size="sm"
            loading={loading}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={refresh}
          >
            Refresh
          </Button>
        }
      />

      {welcomeMessage && <SuccessMessage message={welcomeMessage} />}

      {usingMock && (
        <AlertBanner
          variant="warning"
          title="Showing sample data"
          message={
            error
              ? `${error} — connect the backend on port 4000 or sign in to load live data.`
              : 'Backend unavailable. Sample data is shown until the API responds.'
          }
        />
      )}

      <section aria-label="Summary metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total income"
            value={formatCurrency(summary?.totalIncome ?? 0, currency)}
            subtitle="All time in range"
            loading={loading}
            badge={<StatCardBadge variant="income">Inflow</StatCardBadge>}
          />
          <StatCard
            title="Total expenses"
            value={formatCurrency(summary?.totalExpense ?? 0, currency)}
            change={expenseDelta.change}
            changeLabel={expenseDelta.changeLabel}
            trend={expenseDelta.trend === 'up' ? 'down' : expenseDelta.trend === 'down' ? 'up' : undefined}
            loading={loading}
            badge={<StatCardBadge variant="expense">Outflow</StatCardBadge>}
          />
          <StatCard
            title="Net savings"
            value={formatCurrency(summary?.netSavings ?? 0, currency)}
            subtitle="Income minus expenses"
            trend={(summary?.netSavings ?? 0) >= 0 ? 'up' : 'down'}
            loading={loading}
            badge={<StatCardBadge variant="success">Net</StatCardBadge>}
          />
          <StatCard
            title="Transactions"
            value={String(summary?.transactionCount ?? 0)}
            subtitle="Recorded in period"
            loading={loading}
          />
        </div>
      </section>

      <section aria-label="Charts">
        <div className="grid gap-4 lg:grid-cols-5">
          <ExpenseTrendChart
            className="lg:col-span-3"
            data={monthlyTrend}
            currency={currency}
            loading={loading}
          />
          <CategoryDonutChart
            className="lg:col-span-2"
            data={categorySpending}
            currency={currency}
            loading={loading}
          />
        </div>
      </section>

      <section aria-label="Activity and budgets">
        <div className="grid gap-4 lg:grid-cols-2">
          <RecentTransactions
            transactions={recentTransactions}
            currency={currency}
            loading={loading}
          />
          <BudgetStatusWidget
            budgets={budgetStatuses}
            currency={currency}
            loading={loading}
          />
        </div>
      </section>

      <section aria-label="AI insights">
        <SectionHeader
          title="AI insights"
          description={
            hasLiveAiInsight
              ? 'Personalized scores and tips from Gemini — open AI Insights for the full assessment.'
              : 'Generate a financial health assessment powered by LangChain and Google Gemini.'
          }
          action={
            <Link to={ROUTES.AI}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Open AI hub
              </Button>
            </Link>
          }
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id ?? insight.title}
              title={insight.title}
              summary={insight.summary}
              type={insight.type}
              tag={insight.tag}
              healthScore={insight.healthScore}
              tips={insight.tips}
              isPlaceholder={insight.isPlaceholder}
              model={insight.model}
              createdAt={insight.createdAt}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
