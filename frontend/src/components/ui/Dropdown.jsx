import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/cn.js'

const DropdownContext = createContext(null)

export function Dropdown({ children, align = 'end' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const menuId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return undefined

    function handlePointer(event) {
      if (!containerRef.current?.contains(event.target)) {
        close()
      }
    }

    function handleKey(event) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, close])

  return (
    <DropdownContext.Provider
      value={{ open, setOpen, close, menuId, align }}
    >
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownTrigger({ children, className }) {
  const { open, setOpen, menuId } = useContext(DropdownContext)

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls={menuId}
      className={className}
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  )
}

export function DropdownMenu({ children, className }) {
  const { open, menuId, align } = useContext(DropdownContext)
  if (!open) return null

  return (
    <div
      id={menuId}
      role="menu"
      className={cn(
        'absolute z-40 mt-2 min-w-[10rem] rounded-lg border border-border bg-surface py-1 shadow-[var(--shadow-elevated)]',
        align === 'start' ? 'left-0' : 'right-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  destructive = false,
  disabled = false,
  className,
}) {
  const { close } = useContext(DropdownContext)

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        'flex w-full items-center px-3 py-2 text-left text-sm transition-colors',
        destructive
          ? 'text-danger hover:bg-danger-muted'
          : 'text-foreground hover:bg-background',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      onClick={() => {
        if (disabled) return
        onClick?.()
        close()
      }}
    >
      {children}
    </button>
  )
}
