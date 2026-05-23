import StatCard from '@/components/ui/StatCard.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { Card } from '@/components/ui/Card.jsx'
import { formatCurrency } from '@/utils/format.js'

export default function ReportSummaryCards({
  summary,
  currency = 'USD',
  loading = false,
}) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding>
            <SkeletonLoader className="mb-2 h-3 w-1/2" />
            <SkeletonLoader className="h-7 w-2/3" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        subtitle="For selected period"
      />
      <StatCard
        title="Transactions"
        value={String(summary?.transactionCount ?? 0)}
      />
    </div>
  )
}
