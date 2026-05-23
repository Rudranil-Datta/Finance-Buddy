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
import { CHART_COLORS } from '../utils/chartTheme.js'
import DefaultChartTooltip from './ChartTooltip.jsx'

export default function ExpenseTrendChart({
  data = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const chartData = data.map((row) => ({
    period: row.period,
    expense: row.expense ?? row.totalExpense ?? row.total ?? 0,
  }))

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Spending trend</CardTitle>
        <CardDescription>Monthly expense totals over your selected period</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex-1">
        {loading ? (
          <SkeletonLoader className="h-[280px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="No spending trend"
            description="Add expense transactions to visualize monthly patterns."
            className="h-[260px]"
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.expense} stopOpacity={0.3} />
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
                width={56}
              />
              <Tooltip content={<DefaultChartTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke={CHART_COLORS.expense}
                strokeWidth={2}
                fill="url(#analyticsExpenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
