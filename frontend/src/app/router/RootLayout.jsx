import { Outlet } from 'react-router-dom'
import { AppErrorBoundary } from '@/components/feedback'
import AuthSessionSync from './AuthSessionSync.jsx'

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <AuthSessionSync />
      <Outlet />
    </AppErrorBoundary>
  )
}
