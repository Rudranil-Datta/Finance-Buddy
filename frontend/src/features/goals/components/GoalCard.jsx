import { Calendar, Pencil, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency, formatDate } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import GoalProgressBar from './GoalProgressBar.jsx'
import MilestoneTrack from './MilestoneTrack.jsx'

const statusVariant = {
  active: 'accent',
  completed: 'success',
  paused: 'warning',
}

export default function GoalCard({
  goal,
  currency = 'USD',
  onEdit,
  onDelete,
  onContribute,
  className,
}) {
  const canContribute = goal.status === 'active' && !goal.progress?.isComplete

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="mb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2">{goal.title}</CardTitle>
          <Badge variant={statusVariant[goal.status] ?? 'default'} size="sm">
            {goal.status}
          </Badge>
        </div>
        {goal.deadline && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Calendar className="h-3 w-3" />
            Target by {formatDate(goal.deadline)}
          </p>
        )}
      </CardHeader>

      <CardContent className="mt-4 flex flex-1 flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(goal.targetAmount, currency)}
          </p>
          <p className="text-xs text-muted">target</p>
        </div>

        <GoalProgressBar goal={goal} currency={currency} />
        <MilestoneTrack milestones={goal.milestones} currency={currency} />

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
          {canContribute && (
            <Button
              type="button"
              size="sm"
              className="flex-1"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => onContribute?.(goal)}
            >
              Contribute
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => onEdit?.(goal)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger-muted"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => onDelete?.(goal)}
            aria-label={`Delete ${goal.title}`}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
