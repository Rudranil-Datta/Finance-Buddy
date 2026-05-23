import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { Receipt } from 'lucide-react'
import TransactionRow from './TransactionRow.jsx'

export default function TransactionTable({
  transactions = [],
  currency = 'USD',
  loading = false,
  onEdit,
  onDelete,
  onAdd,
}) {
  if (loading) {
    return (
      <div className="hidden rounded-xl border border-border bg-surface md:block">
        <div className="space-y-0 divide-y divide-border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <SkeletonLoader className="h-8 w-8 rounded-full" />
              <SkeletonLoader className="h-4 flex-1" />
              <SkeletonLoader className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="hidden md:block">
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="No transactions found"
          description="Adjust filters or add your first transaction to get started."
          action={onAdd}
        />
      </div>
    )
  }

  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TransactionRow
                transaction={tx}
                currency={currency}
                onEdit={() => onEdit(tx)}
                onDelete={() => onDelete(tx)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
