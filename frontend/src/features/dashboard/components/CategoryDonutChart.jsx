import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

const FALLBACK_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#8b5cf6',
]

function DonutTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-elevated)]">
      <p className="font-medium text-foreground">{item.name}</p>
      <p className="mt-1 text-muted">
        {formatCurrency(item.value, currency)}
        {item.percentage != null && ` · ${formatPercent(item.percentage)}`}
      </p>
    </div>
  )
}

export default function CategoryDonutChart({
  data = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const chartData = data
    .filter((row) => (row.total ?? 0) > 0)
    .map((row, index) => ({
      name: row.categoryName ?? 'Other',
      value: row.total ?? 0,
      percentage: row.percentage,
      fill: row.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }))

  const total = chartData.reduce((sum, row) => sum + row.value, 0)

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>Where your money went this period</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[280px] flex-1">
        {loading ? (
          <SkeletonLoader className="mx-auto h-[220px] w-[220px] rounded-full" />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="No category breakdown"
            description="Expense transactions will populate this chart."
            className="h-[240px]"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <ResponsiveContainer width="100%" height={220} className="max-w-[220px]">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip currency={currency} />} />
              </PieChart>
            </ResponsiveContainer>

            <ul className="w-full min-w-0 flex-1 space-y-2">
              {chartData.slice(0, 6).map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: row.fill }}
                    />
                    <span className="truncate text-foreground">{row.name}</span>
                  </span>
                  <span className="shrink-0 font-medium text-foreground">
                    {formatCurrency(row.value, currency)}
                  </span>
                </li>
              ))}
              <li className="border-t border-border pt-2 text-xs text-muted">
                Total {formatCurrency(total, currency)}
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
