import { cn } from '@/lib/cn.js'

export function Table({ className, children }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]">
      <table className={cn('w-full min-w-[36rem] border-collapse text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className, children }) {
  return (
    <thead className={cn('border-b border-border bg-background', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ className, children }) {
  return <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
}

export function TableRow({ className, children, onClick }) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-background/80',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, children }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({ className, children }) {
  return (
    <td className={cn('px-4 py-3 text-foreground', className)}>{children}</td>
  )
}

export default Table
