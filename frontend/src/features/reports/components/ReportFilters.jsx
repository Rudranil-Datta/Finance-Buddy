import Button from '@/components/ui/Button.jsx'
import Select from '@/components/ui/Select.jsx'
import Input from '@/components/ui/Input.jsx'
import { Card } from '@/components/ui/Card.jsx'
import { REPORT_DATE_PRESETS } from '../utils/reportHelpers.js'
import { cn } from '@/lib/cn.js'

export default function ReportFilters({
  filters,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
  className,
}) {
  const showCustom = filters.preset === 'custom'

  return (
    <Card padding className={cn('space-y-4', className)}>
      <p className="text-sm font-medium text-foreground">Report period</p>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="w-full sm:w-48">
          <Select
            id="report-preset"
            value={filters.preset}
            onChange={(e) => onPresetChange(e.target.value)}
            aria-label="Report period"
          >
            {REPORT_DATE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        {showCustom && (
          <>
            <div className="w-full sm:w-40">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                aria-label="Start date"
              />
            </div>
            <div className="w-full sm:w-40">
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                aria-label="End date"
              />
            </div>
          </>
        )}
        <Button type="button" variant="secondary" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Card>
  )
}
