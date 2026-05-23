import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

export default function IncomeExpenseChart({
  data = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const chartData = data.map((row) => ({
    period: row.period,
    income: row.income ?? 0,
    expense: row.expense ?? row.totalExpense ?? row.total ?? 0,
  }))

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Income vs expense</CardTitle>
        <CardDescription>Compare cash inflows and outflows by month</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex-1">
        {loading ? (
          <SkeletonLoader className="h-[280px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="No comparison data"
            description="Record income and expenses to see monthly comparisons."
            className="h-[260px]"
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(value) => (
                  <span className="text-muted">{value}</span>
                )}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill={CHART_COLORS.income}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill={CHART_COLORS.expense}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
