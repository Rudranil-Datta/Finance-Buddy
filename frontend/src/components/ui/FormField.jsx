import { cn } from '@/lib/cn.js'
import { hintBase, labelBase } from '@/lib/variants.js'
import InlineValidation from '@/components/feedback/InlineValidation.jsx'

export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className={labelBase}>
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <InlineValidation message={error} />
      ) : (
        hint && <p className={hintBase}>{hint}</p>
      )}
    </div>
  )
}
