import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency } from '@/utils/format.js'
import { formatPreviewDate, formatTransactionType } from '../utils/importHelpers.js'
import { cn } from '@/lib/cn.js'

export default function ImportPreviewTable({
  rows = [],
  currency = 'USD',
  validCount = 0,
  invalidCount = 0,
}) {
  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="No preview yet"
            description="Upload a CSV file to review transactions before importing."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>Import preview</CardTitle>
            <CardDescription>
              {rows.length} row{rows.length === 1 ? '' : 's'} · {validCount} ready to import
              {invalidCount > 0 && ` · ${invalidCount} will be skipped`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="success" size="sm">
              {validCount} valid
            </Badge>
            {invalidCount > 0 && (
              <Badge variant="danger" size="sm">
                {invalidCount} invalid
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.rowIndex}
                className={cn(!row.isValid && 'bg-danger-muted/30')}
              >
                <TableCell className="text-muted">{row.rowIndex}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatPreviewDate(row.date ?? row.dateStr)}
                </TableCell>
                <TableCell className="max-w-[140px]">
                  <p className="truncate font-medium text-foreground">{row.title}</p>
                  {row.notes && (
                    <p className="truncate text-xs text-muted">{row.notes}</p>
                  )}
                </TableCell>
                <TableCell className="max-w-[100px] truncate text-sm">
                  {row.categoryName || '—'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.type === 'income' ? 'success' : 'outline'}
                    size="sm"
                  >
                    {formatTransactionType(row.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium whitespace-nowrap">
                  {row.amount != null
                    ? formatCurrency(row.amount, currency)
                    : '—'}
                </TableCell>
                <TableCell className="min-w-[120px]">
                  {row.isValid ? (
                    <div className="space-y-1">
                      <Badge variant="success" size="sm">
                        Ready
                      </Badge>
                      {row.warnings?.length > 0 && (
                        <p className="text-xs text-warning">{row.warnings[0]}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-danger">
                      {row.errors.join(', ')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
