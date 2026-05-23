import { LayoutDashboard, Plus } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Button from '@/components/ui/Button.jsx'

export default function EmptyDashboardState({
  onAddTransaction,
  onImport,
  title = 'Your dashboard is empty',
  description = 'Add transactions or import data to see analytics and insights.',
}) {
  return (
    <EmptyState
      icon={<LayoutDashboard className="h-6 w-6" />}
      title={title}
      description={description}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          {onAddTransaction && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onAddTransaction}
            >
              Add transaction
            </Button>
          )}
          {onImport && (
            <Button variant="secondary" onClick={onImport}>
              Import data
            </Button>
          )}
        </div>
      }
    />
  )
}
