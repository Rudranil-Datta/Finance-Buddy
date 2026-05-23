import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import InsightCard from '@/features/dashboard/components/InsightCard.jsx'
import { ROUTES } from '@/app/router/paths.js'
import { cn } from '@/lib/cn.js'

export default function FinancialInsightsCard({
  insights = [],
  loading = false,
  className,
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Financial insights</h2>
          <p className="text-sm text-muted">
            Personalized recommendations from your persisted Gemini assessments
          </p>
        </div>
        <Link to={ROUTES.AI}>
          <Button variant="secondary" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
            AI advisor
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding>
              <SkeletonLoader className="mb-3 h-9 w-9 rounded-lg" />
              <SkeletonLoader className="mb-2 h-4 w-3/4" />
              <SkeletonLoader className="h-12 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              summary={insight.summary}
              type={insight.type}
              tag={insight.tag}
              healthScore={insight.healthScore}
              tips={insight.tips}
              isPlaceholder={insight.isPlaceholder}
              model={insight.model}
              createdAt={insight.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
