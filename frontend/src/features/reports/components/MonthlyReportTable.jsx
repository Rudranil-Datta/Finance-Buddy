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
import { formatCurrency, formatPeriod } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

export default function MonthlyReportTable({
  monthly = [],
  currency = 'USD',
  loading = false,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>Income, expenses, and net by month</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <SkeletonLoader className="h-48 w-full" />
        ) : monthly.length === 0 ? (
          <EmptyState title="No monthly data" description="No transactions in this period." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthly.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium">
                    {formatPeriod(row.period)}
                  </TableCell>
                  <TableCell className="text-right text-income">
                    {formatCurrency(row.income, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.expense, currency)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium',
                      row.netSavings >= 0 ? 'text-success' : 'text-danger',
                    )}
                  >
                    {formatCurrency(row.netSavings, currency)}
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
