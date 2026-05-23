import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import { downloadCsv, downloadCsvFromRows, rowsToCsv } from '@/utils/csvExport.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import { useReports } from '../hooks/useReports.js'
import {
  categoriesToCsvRows,
  filenameForExport,
  monthlyToCsvRows,
  summaryToCsvRows,
} from '../utils/reportHelpers.js'
import {
  ReportFilters,
  ReportSummaryCards,
  ReportExportPanel,
  CategoryReportTable,
  MonthlyReportTable,
} from '../components/index.js'

export default function ReportsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY
  const [exportType, setExportType] = useState('transactions')

  const {
    filters,
    setFilter,
    resetFilters,
    loading,
    exporting,
    usingMock,
    error,
    summary,
    categorySpending,
    monthlySummaries,
    refresh,
    exportTransactions,
  } = useReports()

  async function handleExport() {
    try {
      if (exportType === 'transactions') {
        await exportTransactions()
        toast.success('Transactions exported')
        return
      }

      const filename = filenameForExport(exportType)

      if (exportType === 'summary') {
        const rows = summaryToCsvRows(summary).slice(1)
        downloadCsv(
          rowsToCsv(['Metric', 'Value'], rows),
          filename,
        )
      } else if (exportType === 'categories') {
        const { headers, rows } = categoriesToCsvRows(categorySpending)
        downloadCsvFromRows(headers, rows, filename)
      } else if (exportType === 'monthly') {
        const { headers, rows } = monthlyToCsvRows(monthlySummaries)
        downloadCsvFromRows(headers, rows, filename)
      }

      toast.success('Report downloaded')
    } catch (err) {
      toast.error(err?.message || 'Export failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Financial summaries, breakdowns, and CSV exports for your records."
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
          message="Start the API server to load live report data. Transaction export requires the backend."
        />
      )}

      {error && !usingMock && (
        <AlertBanner variant="warning" title="Load issue" message={error} />
      )}

      <ReportFilters
        filters={filters}
        onPresetChange={(v) => setFilter('preset', v)}
        onStartDateChange={(v) => setFilter('startDate', v)}
        onEndDateChange={(v) => setFilter('endDate', v)}
        onReset={resetFilters}
      />

      <ReportSummaryCards summary={summary} currency={currency} loading={loading} />

      <ReportExportPanel
        exportType={exportType}
        onExportTypeChange={setExportType}
        onExport={handleExport}
        exporting={exporting}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyReportTable
          monthly={monthlySummaries}
          currency={currency}
          loading={loading}
        />
        <CategoryReportTable
          categories={categorySpending}
          currency={currency}
          loading={loading}
        />
      </div>
    </div>
  )
}
