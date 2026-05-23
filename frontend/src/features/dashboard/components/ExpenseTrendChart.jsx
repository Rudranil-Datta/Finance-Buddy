import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrencyCompact, formatPeriod } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

const CHART_COLORS = {
  expense: '#4f46e5',
  income: '#10b981',
  grid: '#e2e8f0',
  axis: '#94a3b8',
}

function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-elevated)]">
      <p className="font-medium text-foreground">{formatPeriod(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 text-muted">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{' '}
          <span className="font-medium text-foreground">
            {formatCurrencyCompact(entry.value, currency)}
          </span>
        </p>
      ))}
    </div>
  )
}

export default function ExpenseTrendChart({
  data = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const chartData = data.map((row) => ({
    period: row.period,
    expense: row.expense ?? row.totalExpense ?? row.total ?? 0,
    income: row.income ?? 0,
  }))

  const hasIncome = chartData.some((row) => row.income > 0)

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Expense trend</CardTitle>
        <CardDescription>
          Monthly spending{hasIncome ? ' and income' : ''} over time
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[280px] flex-1">
        {loading ? (
          <SkeletonLoader className="h-[260px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="No trend data yet"
            description="Add transactions to see spending patterns over time."
            className="h-[240px]"
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.expense} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={CHART_COLORS.expense} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatPeriod}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCurrencyCompact(v, currency)}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<ChartTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke={CHART_COLORS.expense}
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
              {hasIncome && (
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke={CHART_COLORS.income}
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="4 4"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
