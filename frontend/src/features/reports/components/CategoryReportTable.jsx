import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'

export default function CategoryReportTable({
  categories = [],
  currency = 'USD',
  loading = false,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category spending summary</CardTitle>
        <CardDescription>Expense totals and share of spending</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <SkeletonLoader className="h-48 w-full" />
        ) : categories.length === 0 ? (
          <EmptyState title="No category data" description="No expenses in this period." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((row) => (
                <TableRow key={row.categoryId ?? row.categoryName}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: row.color ?? '#94a3b8' }}
                      />
                      {row.categoryName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(row.total, currency)}
                  </TableCell>
                  <TableCell className="text-right text-muted">
                    {row.count ?? '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted">
                    {row.percentage != null ? formatPercent(row.percentage) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
