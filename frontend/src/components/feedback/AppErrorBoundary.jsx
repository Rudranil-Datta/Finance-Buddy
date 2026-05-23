import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card.jsx'
import Button from '@/components/ui/Button.jsx'
import { APP_NAME } from '@/utils/constants.js'

/**
 * Catches unexpected React render errors in the tree below.
 */
export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card padding className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {APP_NAME}
            </p>
            <h1 className="mt-2 text-lg font-semibold text-foreground">
              Application error
            </h1>
            <p className="mt-2 text-sm text-muted">{this.state.message}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset}>Try again</Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                Reload app
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
