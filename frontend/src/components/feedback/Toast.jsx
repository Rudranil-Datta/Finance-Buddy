import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toastContext.js'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn.js'
import Button from '@/components/ui/Button.jsx'

const VARIANTS = {
  info: {
    icon: Info,
    className: 'border-border bg-surface text-foreground',
    iconClass: 'text-accent',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-success/20 bg-success-muted text-success',
    iconClass: 'text-success',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-warning/20 bg-warning-muted text-warning',
    iconClass: 'text-warning',
  },
  error: {
    icon: AlertCircle,
    className: 'border-danger/20 bg-danger-muted text-danger',
    iconClass: 'text-danger',
  },
}

function ToastItem({ toast, onDismiss }) {
  const config = VARIANTS[toast.variant] ?? VARIANTS.info
  const Icon = config.icon

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-[var(--shadow-elevated)]',
        config.className,
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconClass)} aria-hidden />
      <div className="min-w-0 flex-1">
        {toast.title && <p className="text-sm font-medium">{toast.title}</p>}
        {toast.message && (
          <p className={cn('text-sm', toast.title && 'mt-0.5 opacity-90')}>
            {toast.message}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 px-1"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, message, variant = 'info', duration = 4000 }) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now())

      setToasts((current) => [...current, { id, title, message, variant }])

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }

      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toast,
      dismiss,
      success: (message, options) =>
        toast({ message, variant: 'success', ...options }),
      error: (message, options) =>
        toast({ message, variant: 'error', ...options }),
      info: (message, options) =>
        toast({ message, variant: 'info', ...options }),
      warning: (message, options) =>
        toast({ message, variant: 'warning', ...options }),
    }),
    [toast, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:bottom-6 sm:right-6"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export default ToastProvider
