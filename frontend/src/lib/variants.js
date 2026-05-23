/**
 * Shared style fragments for UI consistency.
 */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export const disabledStyles = 'disabled:pointer-events-none disabled:opacity-50'

export const inputBase =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export const inputError = 'border-danger focus:border-danger focus:ring-danger/20'

export const labelBase = 'text-sm font-medium text-foreground'

export const hintBase = 'text-xs text-muted'

export const cardBase =
  'rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]'
