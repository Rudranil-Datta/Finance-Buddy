import { cn } from '@/lib/cn.js'

export default function SkeletonLoader({ className, ...props }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-border/60',
        className,
      )}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          className={cn('h-3', index === lines - 1 ? 'w-4/5' : 'w-full')}
        />
      ))}
    </div>
  )
}
