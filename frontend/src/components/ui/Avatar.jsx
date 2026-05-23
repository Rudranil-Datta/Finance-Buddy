import { cn } from '@/lib/cn.js'

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
}) {
  const initials = getInitials(name || alt)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn(
          'rounded-full object-cover ring-2 ring-border bg-surface',
          sizes[size],
          className,
        )}
      />
    )
  }

  return (
    <span
      aria-hidden={!alt}
      title={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-accent-muted font-semibold text-accent ring-2 ring-border',
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
