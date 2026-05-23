import { Outlet } from 'react-router-dom'

/**
 * Minimal layout for 404 and other standalone pages.
 */
export default function MinimalLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <Outlet />
    </div>
  )
}
