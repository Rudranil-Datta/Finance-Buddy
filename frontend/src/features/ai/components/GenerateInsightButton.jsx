import { Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'

export default function GenerateInsightButton({
  onClick,
  loading = false,
  disabled = false,
  className,
}) {
  return (
    <Button
      className={className}
      loading={loading}
      disabled={disabled || loading}
      leftIcon={!loading ? <Sparkles className="h-4 w-4" /> : undefined}
      onClick={onClick}
    >
      Generate insight
    </Button>
  )
}
