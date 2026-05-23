import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import PageHeader from './PageHeader.jsx'
import { ROUTES } from '@/app/router/paths.js'

/**
 * Minimal page shell for layout testing — replaced in feature phases.
 */
export default function RoutePlaceholder({ title, description, badge }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          badge ? <Badge variant="accent">{badge}</Badge> : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Content area</CardTitle>
          <CardDescription>
            Feature UI will render here. Layout and navigation are ready to test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            Resize the window to verify mobile sidebar, top bar, and content
            max-width behavior.
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-hover"
          >
            ← Back to dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
