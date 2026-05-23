import { isRouteErrorResponse, useRouteError, useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import FullPageError from '@/components/feedback/FullPageError.jsx'
import Button from '@/components/ui/Button.jsx'
import NotFoundPage from '@/pages/NotFoundPage.jsx'
import { DEFAULT_AUTHENTICATED_ROUTE } from './paths.js'

/**
 * React Router errorElement — route loaders, actions, and thrown route errors.
 */
export default function RouteErrorFallback() {
  const error = useRouteError()
  const navigate = useNavigate()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage variant="standalone" />
  }

  const message = isRouteErrorResponse(error)
    ? error.statusText || error.data?.message || `Error ${error.status}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <FullPageError
        title="Something went wrong"
        message={message}
        onRetry={() => navigate(0)}
        retryLabel="Reload page"
        secondaryAction={
          <Button
            variant="secondary"
            leftIcon={<Home className="h-4 w-4" />}
            onClick={() => navigate(DEFAULT_AUTHENTICATED_ROUTE, { replace: true })}
          >
            Go to dashboard
          </Button>
        }
      />
    </div>
  )
}
