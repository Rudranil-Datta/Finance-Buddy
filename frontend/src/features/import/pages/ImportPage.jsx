import { useMemo, useState } from 'react'
import { CheckCircle2, FileUp, Download } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth.js'
import { useToast } from '@/components/feedback/useToast.js'
import { importApi } from '@/api'
import { DEFAULT_CURRENCY } from '@/utils/constants.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import { Card } from '@/components/ui/Card.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import {
  CSV_COLUMNS,
  getSampleCsv,
  parseCsvForPreview,
} from '../utils/importHelpers.js'
import { useImportCategories } from '../hooks/useImportCategories.js'
import {
  CsvUploadZone,
  ImportPreviewTable,
  ImportConfirmModal,
} from '../components/index.js'
import { downloadCsv } from '@/utils/csvExport.js'

export default function ImportPage() {
  const { user } = useAuth()
  const toast = useToast()
  const currency = user?.currency ?? DEFAULT_CURRENCY
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useImportCategories()

  const [csvFile, setCsvFile] = useState(null)
  const [csvError, setCsvError] = useState(null)
  const [importing, setImporting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const preview = useMemo(() => {
    if (!csvFile?.content || categoriesLoading) return null
    return parseCsvForPreview(csvFile.content, categories)
  }, [csvFile?.content, categories, categoriesLoading])

  const previewTotal = useMemo(() => {
    if (!preview?.rows) return 0
    return preview.rows
      .filter((r) => r.isValid)
      .reduce((sum, r) => sum + (r.amount ?? 0), 0)
  }, [preview])

  function handleFileSelect(file, message) {
    setLastResult(null)
    if (!file) {
      setCsvFile(null)
      setCsvError(message || null)
      return
    }
    setCsvError(null)
    setCsvFile(file)
  }

  function clearCsv() {
    setCsvFile(null)
    setCsvError(null)
    setLastResult(null)
  }

  function downloadTemplate() {
    downloadCsv(getSampleCsv(), 'finance-buddy-import-template.csv')
    toast.success('Template downloaded')
  }

  function openCsvConfirm() {
    if (!csvFile?.content) {
      toast.error('Upload a CSV file first')
      return
    }
    if (preview?.fileError) {
      toast.error(preview.fileError)
      return
    }
    if (preview?.validCount === 0) {
      toast.error('No valid rows to import')
      return
    }
    setConfirmOpen(true)
  }

  async function handleCsvImport() {
    if (!csvFile?.content) return
    setImporting(true)
    try {
      const result = await importApi.importCsv(csvFile.content)
      const imported = result?.imported ?? 0
      const skipped = result?.skipped ?? 0

      setLastResult({ imported, skipped })
      setConfirmOpen(false)
      clearCsv()

      if (skipped > 0) {
        toast.success(`Imported ${imported} transactions (${skipped} skipped)`)
      } else {
        toast.success(`Imported ${imported} transactions`)
      }
    } catch (err) {
      toast.error(err?.message || 'CSV import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import transactions"
        description="Upload a CSV to bulk-add income and expenses. Preview and fix issues before confirming."
      />

      {lastResult && (
        <AlertBanner
          variant="success"
          title="Import complete"
          message={
            lastResult.skipped > 0
              ? `${lastResult.imported} transaction${lastResult.imported === 1 ? '' : 's'} imported · ${lastResult.skipped} row${lastResult.skipped === 1 ? '' : 's'} skipped`
              : `${lastResult.imported} transaction${lastResult.imported === 1 ? '' : 's'} added from CSV.`
          }
        />
      )}

      {categoriesError && (
        <AlertBanner
          variant="warning"
          title="Categories unavailable"
          message={categoriesError}
        />
      )}

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">Upload file</h2>
                <p className="mt-1 text-sm text-muted">
                  Header row required. Columns:{' '}
                  {CSV_COLUMNS.map((c, i) => (
                    <span key={c}>
                      {i > 0 && ', '}
                      <code className="text-foreground">{c}</code>
                    </span>
                  ))}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={downloadTemplate}
              >
                Template
              </Button>
            </div>

            {categoriesLoading ? (
              <SkeletonLoader className="h-40 w-full rounded-xl" />
            ) : (
              <CsvUploadZone
                fileName={csvFile?.name}
                onFileSelect={(file, err) => handleFileSelect(file, err)}
                onClear={clearCsv}
                disabled={importing || Boolean(categoriesError)}
              />
            )}

            {csvError && (
              <p className="mt-3 text-sm text-danger" role="alert">
                {csvError}
              </p>
            )}
            {preview?.fileError && !csvError && (
              <p className="mt-3 text-sm text-danger" role="alert">
                {preview.fileError}
              </p>
            )}
          </Card>

          <Card padding className="flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Ready to import?</h2>
              <p className="mt-1 text-sm text-muted">
                Review the preview below, then confirm to add transactions to your ledger.
              </p>
              {preview && !preview.fileError && (
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {preview.validCount} valid row{preview.validCount === 1 ? '' : 's'}
                  </li>
                  {preview.invalidCount > 0 && (
                    <li className="text-warning">
                      {preview.invalidCount} row{preview.invalidCount === 1 ? '' : 's'} will be
                      skipped
                    </li>
                  )}
                </ul>
              )}
            </div>
            <Button
              type="button"
              className="mt-6 w-full sm:w-auto"
              leftIcon={<FileUp className="h-4 w-4" />}
              disabled={
                !preview?.validCount || importing || categoriesLoading || categoriesError
              }
              onClick={openCsvConfirm}
            >
              Review & import
            </Button>
          </Card>
        </div>

        <ImportPreviewTable
          rows={preview?.rows ?? []}
          currency={currency}
          validCount={preview?.validCount ?? 0}
          invalidCount={preview?.invalidCount ?? 0}
        />
      </div>

      <ImportConfirmModal
        open={confirmOpen}
        validCount={preview?.validCount ?? 0}
        invalidCount={preview?.invalidCount ?? 0}
        totalAmount={previewTotal}
        currency={currency}
        loading={importing}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCsvImport}
      />
    </div>
  )
}
