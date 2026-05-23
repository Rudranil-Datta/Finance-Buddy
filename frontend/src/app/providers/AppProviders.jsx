import { AuthProvider } from '@/context/AuthProvider.jsx'
import { ToastProvider } from '@/components/feedback/Toast.jsx'

/**
 * Central provider composition.
 *
 * Future providers (add in order, outer → inner):
 * - ThemeProvider
 * - QueryClientProvider (TanStack Query)
 * - NotificationProvider
 * - AIAssistantProvider
 */
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* <ThemeProvider> */}
        {/* <QueryClientProvider client={queryClient}> */}
        {/* <NotificationProvider> */}
        {children}
        {/* </NotificationProvider> */}
        {/* </QueryClientProvider> */}
        {/* </ThemeProvider> */}
      </ToastProvider>
    </AuthProvider>
  )
}
