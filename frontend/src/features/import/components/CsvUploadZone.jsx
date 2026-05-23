import { useRef, useState } from 'react'
import { FileSpreadsheet, Upload, X } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import Button from '@/components/ui/Button.jsx'
import { getSampleCsv } from '../utils/importHelpers.js'

export default function CsvUploadZone({
  fileName,
  onFileSelect,
  onClear,
  disabled = false,
  className,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(files) {
    const file = files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onFileSelect?.(null, 'Please upload a .csv file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      onFileSelect?.(null, 'File must be under 2 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onFileSelect?.({
        name: file.name,
        content: String(reader.result ?? ''),
      })
    }
    reader.onerror = () => onFileSelect?.(null, 'Could not read file')
    reader.readAsText(file)
  }

  function onDrop(event) {
    event.preventDefault()
    setDragOver(false)
    if (disabled) return
    handleFiles(event.dataTransfer.files)
  }

  function loadSample() {
    onFileSelect?.({ name: 'sample-import.csv', content: getSampleCsv() })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver
            ? 'border-accent bg-accent-muted'
            : 'border-border bg-background hover:border-border-strong hover:bg-surface',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted text-accent">
          <Upload className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">
          Drop CSV here or click to browse
        </p>
        <p className="mt-1 text-xs text-muted">
          title, amount, date + optional category, type, notes · max 2 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {fileName && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-foreground">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate">{fileName}</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 px-2"
            onClick={(e) => {
              e.stopPropagation()
              onClear?.()
              if (inputRef.current) inputRef.current.value = ''
            }}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button type="button" variant="secondary" size="sm" onClick={loadSample} disabled={disabled}>
        Load sample CSV
      </Button>
    </div>
  )
}
