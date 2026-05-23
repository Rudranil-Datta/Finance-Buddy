import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/cn.js'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const active = value !== undefined ? value : internal

  const setActive = (next) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-surface text-foreground shadow-sm'
          : 'text-muted hover:text-foreground',
        className,
      )}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null

  return (
    <div role="tabpanel" className={cn('mt-4', className)}>
      {children}
    </div>
  )
}

export default Tabs
