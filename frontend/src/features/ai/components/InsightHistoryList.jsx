import { History } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import InsightCard from './InsightCard.jsx'
import { cn } from '@/lib/cn.js'

export default function InsightHistoryList({
  insights = [],
  loading = false,
  className,
  emptyAction,
}) {
  return (
    <section className={cn('space-y-4', className)} aria-label="Insight history">
      <SectionHeader
        title="Insight history"
        description="Past assessments, recommendations, and savings tips."
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <EmptyState
          icon={<History className="h-5 w-5" />}
          title="No insights yet"
          description="Generate your first financial health assessment to see personalized guidance here."
          action={emptyAction}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              summary={insight.summary}
              type={insight.type}
              healthScore={insight.healthScore}
              tips={insight.tips}
              isMock={insight.isMock}
              cached={insight.cached}
              cacheExpired={insight.cacheExpired}
              expiresAt={insight.expiresAt}
              createdAt={insight.createdAt}
              model={insight.model}
            />
          ))}
        </div>
      )}
    </section>
  )
}
