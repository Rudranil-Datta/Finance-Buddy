import { RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import { formatCurrency } from '@/utils/format.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import StatCard from '@/components/ui/StatCard.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { Card } from '@/components/ui/Card.jsx'
import { useAnalyticsData } from '../hooks/useAnalyticsData.js'
import {
  AnalyticsFilters,
  ExpenseTrendChart,
  IncomeExpenseChart,
  CategoryBreakdownChart,
  MonthlySummaryCard,
  FinancialInsightsCard,
  TopCategoriesList,
} from '../components/index.js'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const currency = user?.currency ?? DEFAULT_CURRENCY

  const {
    filters,
    setFilter,
    resetFilters,
    loading,
    usingMock,
    error,
    summary,
    monthlyTrend,
    categorySpending,
    incomeVsExpense,
    topCategories,
    monthlySummaries,
    insights,
    categories,
    refresh,
  } = useAnalyticsData()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep-dive into spending trends, categories, and income vs expense."
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

      {usingMock && (
        <AlertBanner
          variant="warning"
          title="Showing sample data"
          message="Connect to the API server to load your real analytics."
        />
      )}

      {error && !usingMock && (
        <AlertBanner variant="warning" title="Partial load issue" message={error} />
      )}

      <AnalyticsFilters
        filters={filters}
        categories={categories}
        onPresetChange={(v) => setFilter('preset', v)}
        onStartDateChange={(v) => setFilter('startDate', v)}
        onEndDateChange={(v) => setFilter('endDate', v)}
        onCategoryChange={(v) => setFilter('categoryId', v)}
        onReset={resetFilters}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding>
              <SkeletonLoader className="mb-2 h-3 w-1/2" />
              <SkeletonLoader className="h-7 w-2/3" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total income"
              value={formatCurrency(summary?.totalIncome ?? 0, currency)}
            />
            <StatCard
              title="Total expenses"
              value={formatCurrency(summary?.totalExpense ?? 0, currency)}
            />
            <StatCard
              title="Net savings"
              value={formatCurrency(summary?.netSavings ?? 0, currency)}
              subtitle="Income minus expenses"
            />
            <StatCard
              title="Transactions"
              value={String(summary?.transactionCount ?? 0)}
              subtitle="In selected period"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseTrendChart
          data={monthlyTrend}
          currency={currency}
          loading={loading}
        />
        <IncomeExpenseChart
          data={incomeVsExpense}
          currency={currency}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <CategoryBreakdownChart
          data={categorySpending}
          currency={currency}
          loading={loading}
          className="lg:col-span-2"
        />
        <TopCategoriesList
          categories={topCategories}
          currency={currency}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MonthlySummaryCard
          summaries={monthlySummaries}
          currency={currency}
          loading={loading}
          className="lg:col-span-1"
        />
        <div className="lg:col-span-2">
          <FinancialInsightsCard insights={insights} loading={loading} />
        </div>
      </div>
    </div>
  )
}
