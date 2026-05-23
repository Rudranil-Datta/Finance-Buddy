import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, TopBar } from '@/components/layout'

/**
 * Authenticated shell: sidebar + top bar + scrollable main content.
 */
export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <TopBar onMenuOpen={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="page-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
