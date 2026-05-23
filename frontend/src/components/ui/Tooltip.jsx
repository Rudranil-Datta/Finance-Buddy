import { cn } from '@/lib/cn.js'

/**
 * Lightweight CSS tooltip — upgrade to Radix later if needed.
 */
export default function Tooltip({
  content,
  children,
  side = 'top',
  className,
}) {
  const positions = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  }

  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-surface shadow-md group-hover:block group-focus-within:block',
          positions[side] ?? positions.top,
        )}
      >
        {content}
      </span>
    </span>
  )
}
