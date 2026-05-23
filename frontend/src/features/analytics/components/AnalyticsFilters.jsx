import Button from '@/components/ui/Button.jsx'
import Select from '@/components/ui/Select.jsx'
import Input from '@/components/ui/Input.jsx'
import { Card } from '@/components/ui/Card.jsx'
import { DATE_PRESETS } from '../utils/analyticsHelpers.js'
import { cn } from '@/lib/cn.js'

export default function AnalyticsFilters({
  filters,
  categories = [],
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onReset,
  className,
}) {
  const showCustom = filters.preset === 'custom'

  return (
    <Card padding className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="w-full sm:w-48">
          <label htmlFor="analytics-preset" className="mb-1.5 block text-sm font-medium text-foreground">
            Period
          </label>
          <Select
            id="analytics-preset"
            value={filters.preset}
            onChange={(e) => onPresetChange(e.target.value)}
          >
            {DATE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>

        {showCustom && (
          <>
            <div className="w-full sm:w-40">
              <label htmlFor="analytics-start" className="mb-1.5 block text-sm font-medium text-foreground">
                From
              </label>
              <Input
                id="analytics-start"
                type="date"
                value={filters.startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <label htmlFor="analytics-end" className="mb-1.5 block text-sm font-medium text-foreground">
                To
              </label>
              <Input
                id="analytics-end"
                type="date"
                value={filters.endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="w-full sm:min-w-[12rem] sm:flex-1">
          <label htmlFor="analytics-category" className="mb-1.5 block text-sm font-medium text-foreground">
            Category
          </label>
          <Select
            id="analytics-category"
            value={filters.categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat._id ?? cat.id} value={cat._id ?? cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <Button type="button" variant="secondary" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </Card>
  )
}
