import { RefreshCw } from 'lucide-react'
import { useToast } from '@/components/feedback/useToast.js'
import PageHeader from '@/components/layout/PageHeader.jsx'
import Button from '@/components/ui/Button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'
import Badge from '@/components/ui/Badge.jsx'
import { formatRelative } from '@/utils/format.js'
import { useAiInsights } from '../hooks/useAiInsights.js'
import {
  HealthScoreRing,
  InsightHistoryList,
  GenerateInsightButton,
  CacheStatusBadge,
} from '../components/index.js'
import { formatCacheExpiry } from '../utils/aiHelpers.js'

export default function AIPage() {
  const toast = useToast()
  const {
    insights,
    latest,
    healthScore,
    hasLiveInsight,
    loading,
    generating,
    error,
    lastGeneratedMock,
    refresh,
    generate,
  } = useAiInsights()

  async function handleGenerate() {
    try {
      const { mock, fromCache, insight: generated } = await generate()
      const normalized = generated ?? latest
      if (mock) {
        toast.success('Demo insight generated from your finance data')
      } else if (fromCache) {
        toast.success('Loaded cached assessment (valid for 24 hours)')
      } else if (
        normalized?.model?.startsWith?.('local-rules')
      ) {
        toast.success(
          'Starter assessment ready — add more transactions for full Gemini analysis',
        )
      } else {
        toast.success('Financial health insight generated')
      }
    } catch {
      toast.error('Could not generate insight')
    }
  }

  const generateControl = (
    <GenerateInsightButton loading={generating} onClick={handleGenerate} />
  )

  const showDemoBanner = lastGeneratedMock && !hasLiveInsight
  const cacheHint = latest?.cached ? formatCacheExpiry(latest.expiresAt) : null

  return (
    <div className="page-stack">
      <PageHeader
        title="AI Insights"
        description="Financial health scores and personalized recommendations powered by LangChain and Google Gemini."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={refresh}
            >
              Refresh
            </Button>
            {generateControl}
          </div>
        }
      />

      {error && !lastGeneratedMock && (
        <AlertBanner variant="warning" title="Load issue" message={error} />
      )}

      {showDemoBanner && (
        <AlertBanner
          variant="info"
          title="Demo assessment"
          message="The API could not be reached — this score was computed locally from your dashboard metrics."
        />
      )}

      {hasLiveInsight && latest?.cached && cacheHint && (
        <AlertBanner
          variant="info"
          title="Cached assessment"
          message={`Using your saved Gemini insight. ${cacheHint}. Generate again after it expires for a fresh analysis.`}
        />
      )}

      <section
        aria-label="Health overview"
        className="grid gap-4 lg:grid-cols-5"
      >
        <HealthScoreRing
          className="lg:col-span-2"
          score={healthScore}
          loading={loading}
        />

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle>Latest assessment</CardTitle>
                <CardDescription>
                  Summary from your most recent financial health run
                </CardDescription>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                <CacheStatusBadge insight={latest} />
                {latest?.isMock && (
                  <Badge variant="outline" size="sm">
                    Demo
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted">Loading assessment…</p>
            ) : latest?.summary ? (
              <>
                <p className="text-sm leading-relaxed text-foreground">
                  {latest.summary}
                </p>
                {latest.tips?.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {latest.tips.slice(0, 3).map((tip) => (
                      <li
                        key={tip}
                        className="flex gap-2 text-sm text-muted"
                      >
                        <span className="text-accent">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
                {(latest.model || latest.createdAt) && (
                  <p className="mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {latest.model && <>Model · {latest.model}</>}
                    {latest.model && latest.createdAt && ' · '}
                    {latest.createdAt &&
                      <>Updated {formatRelative(latest.createdAt)}</>}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted">
                No assessment yet. Generate an insight to see a personalized
                summary based on your transactions and budgets.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <InsightHistoryList
        insights={insights}
        loading={loading}
        emptyAction={generateControl}
      />
    </div>
  )
}
