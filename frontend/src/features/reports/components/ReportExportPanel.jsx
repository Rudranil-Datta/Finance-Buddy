import { Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import Select from '@/components/ui/Select.jsx'
import { EXPORT_TYPES } from '../utils/reportHelpers.js'

export default function ReportExportPanel({
  exportType = 'transactions',
  onExportTypeChange,
  onExport,
  exporting = false,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export reports</CardTitle>
        <CardDescription>
          Download CSV files for transactions, summaries, or breakdowns
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="export-type" className="mb-1.5 block text-sm font-medium text-foreground">
            Report type
          </label>
          <Select
            id="export-type"
            value={exportType}
            onChange={(e) => onExportTypeChange(e.target.value)}
          >
            {EXPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <Button
          leftIcon={<Download className="h-4 w-4" />}
          loading={exporting}
          onClick={onExport}
        >
          Download CSV
        </Button>
      </CardContent>
    </Card>
  )
}
