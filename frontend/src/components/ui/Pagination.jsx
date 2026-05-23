import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import Button from './Button.jsx'

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  siblingCount = 1,
}) {
  if (totalPages <= 1) return null

  const pages = buildPageRange(page, totalPages, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-center gap-1', className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((item, index) =>
        item === '…' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange?.(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

function buildPageRange(page, total, siblingCount) {
  const range = new Set([1, total, page])
  for (let i = 1; i <= siblingCount; i += 1) {
    range.add(page - i)
    range.add(page + i)
  }

  const sorted = [...range].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
    result.push(sorted[i])
  }

  return result
}
