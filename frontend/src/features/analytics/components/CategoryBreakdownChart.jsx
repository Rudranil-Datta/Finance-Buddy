import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import { CHART_COLORS, CHART_PALETTE } from '../utils/chartTheme.js'

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

export default function CategoryBreakdownChart({
  data = [],
  currency = 'USD',
  loading = false,
  className,
}) {
  const [view, setView] = useState('donut')

  const chartData = data
    .filter((row) => (row.total ?? 0) > 0)
    .map((row, index) => ({
      name: row.categoryName ?? 'Other',
      value: row.total ?? 0,
      percentage: row.percentage,
      fill: row.color ?? CHART_PALETTE[index % CHART_PALETTE.length],
    }))

  const total = chartData.reduce((sum, row) => sum + row.value, 0)

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>Category breakdown</CardTitle>
            <CardDescription>Top spending categories in this period</CardDescription>
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-background p-0.5">
            <Button
              type="button"
              size="sm"
              variant={view === 'donut' ? 'primary' : 'ghost'}
              className="px-2.5"
              onClick={() => setView('donut')}
            >
              Donut
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === 'bar' ? 'primary' : 'ghost'}
              className="px-2.5"
              onClick={() => setView('bar')}
            >
              Bars
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px] flex-1">
        {loading ? (
          <SkeletonLoader className="mx-auto h-[240px] w-full max-w-md rounded-lg" />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="No category data"
            description="Expense transactions will populate this breakdown."
            className="h-[260px]"
          />
        ) : view === 'bar' ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => formatCurrency(v, currency)}
                tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<DonutTooltip currency={currency} />} />
              <Bar dataKey="value" name="Spent" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <ResponsiveContainer width="100%" height={240} className="max-w-[240px]">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={96}
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
              {chartData.slice(0, 8).map((row) => (
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
