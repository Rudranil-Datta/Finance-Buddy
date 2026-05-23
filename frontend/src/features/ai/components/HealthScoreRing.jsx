import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import SkeletonLoader from '@/components/ui/SkeletonLoader.jsx'
import { getScoreTone } from '../utils/aiHelpers.js'
import { cn } from '@/lib/cn.js'

const SIZE = 160
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const RING_COLORS = {
  success: '#059669',
  accent: '#4f46e5',
  warning: '#d97706',
  danger: '#e11d48',
  muted: '#cbd5e1',
}

export default function HealthScoreRing({
  score,
  loading = false,
  className,
}) {
  const tone = getScoreTone(score)
  const ringColor = RING_COLORS[tone.variant] ?? RING_COLORS.muted
  const progress = score != null ? Math.min(100, Math.max(0, score)) : 0
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle>Financial health</CardTitle>
        <CardDescription>Composite score from your spending and savings patterns</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center pb-8">
        {loading ? (
          <SkeletonLoader className="h-40 w-40 rounded-full" />
        ) : (
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="-rotate-90"
              aria-hidden
            >
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={STROKE}
              />
              {score != null && (
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-semibold tracking-tight text-foreground">
                {score != null ? score : '—'}
              </span>
              <span className="text-xs text-muted">out of 100</span>
            </div>
          </div>
        )}

        {!loading && (
          <Badge variant={tone.variant} size="lg" className="mt-6">
            {tone.label}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
