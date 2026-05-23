import { WifiOff } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Button from '@/components/ui/Button.jsx'

export default function NetworkErrorState({ onRetry, message }) {
  return (
    <EmptyState
      icon={<WifiOff className="h-6 w-6" />}
      title="Connection problem"
      description={
        message ||
        'Unable to reach the server. Check your connection and try again.'
      }
      action={
        onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  )
}
